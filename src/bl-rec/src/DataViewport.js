import 'date-fns';
import { format } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';import React from 'react';
import PropTypes from 'prop-types';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { TableContainer, Paper, Table, TableHead, TableCell, TableBody, TableRow, Grid, Button, DialogActions, Dialog, DialogTitle, Container, TextField, FormControl, InputLabel, Select, MenuItem, Input, InputAdornment } from '@material-ui/core';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';

var typeDict = {
    '管理费用' : 1,
    '其他费用' : 2,
    '仅23号大院' : 1,
    '仅175' : 2,
    '23号大院和175' : 3
}

function SubmitDialog(props) {
    const { children, title, open, onClose, onSubmit, ...others } = props;

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby='dia-title'>
            <DialogTitle id={title}>{title}</DialogTitle>
            {children}
            <DialogActions>
                <Button autoFocus color='primary' onClick={onSubmit}>提交修改</Button>
            </DialogActions>
        </Dialog>
    );
}

SubmitDialog.propTypes = {
    children : PropTypes.node,
    title : PropTypes.string.isRequired,
    open : PropTypes.bool.isRequired,
    onClose : PropTypes.func.isRequired,
    onSubmit : PropTypes.func.isRequired
}

export default class DataViewport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pk : 0,
            datex : new Date(),
            rtype : 1,
            dtype : 1,
            abst : '',
            inc : 0,
            out : 0,
            detail : '',
            ediOpen : false
        };
    }

    openUpdate = (row) => {
        this.setState({
            pk : row.id,
            datex : new Date(),
            rtype : typeDict[row.rtype],
            dtype : typeDict[row.dtype],
            abst : row.abst,
            inc : row.inc,
            out : row.out,
            detail : row.detail,
            ediOpen : true
        });
    }

    dateChange = (v) => {
        this.setState({
            datex : v
        })
    }

    setAbstract = (e) => {
        this.setState({
            abst : e.target.value
        });
    }

    setRecType = (e) => {
        this.setState({
            rtype : e.target.value
        });
    }
    setIncome = (e) => {
        this.setState({
            inc : e.target.value
        });
    }

    setOutput = (e) => {
        this.setState({
            out : e.target.value
        });
    }

    setDetail = (e) => {
        this.setState({
            detail : e.target.value
        });
    }

    setDisType = (e) => {
        this.setState({
            dtype : e.target.value
        });
    }

    submitUpdate = (e) => {
        axios.post('http://127.0.0.1:8000/rec/edit/',{
            pk : this.state.pk,
            datex : format(this.state.datex, 'yyyy-MM-dd'),
            rectype : this.state.rtype,
            distype : this.state.dtype,
            inc : this.state.inc,
            out : this.state.out,
            detail : this.state.detail,
            abstract : this.state.abst
        }).then(resp=>{
            this.setState({
                ediOpen : false
            });
            this.props.queryAll();
        });
    }

    updateClose = (e) => {
        this.setState({ediOpen : false});
    }

    createTable() {
        return (
            <TableContainer component={Paper}>
                <Table stickyHeader aria-label='table'>
                    <TableHead>
                        <TableRow>
                            {this.props.tab === '0' && <TableCell>操作</TableCell>}
                            <TableCell>日期</TableCell>
                            <TableCell>费用类型</TableCell>
                            <TableCell>报销人</TableCell>
                            <TableCell>摘要</TableCell>
                            <TableCell>收入</TableCell>
                            <TableCell>支出</TableCell>
                            <TableCell>余额</TableCell>
                            <TableCell>备注</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.data.map(row=>(
                            <TableRow key={row.id}>
                                {this.props.tab === '0' &&
                                    <TableCell>
                                        <Grid container spacing={1}>
                                            <Grid item><Button variant='contained' size='small' color='primary' onClick={this.openUpdate.bind(this, row)}>修改</Button></Grid>
                                            <Grid item><Button variant='contained' size='small' color='secondary' onClick={this.props.deleteAction.bind(this, row.id)}>删除</Button></Grid>
                                        </Grid>
                                    </TableCell>}
                                <TableCell align='left'>{row.datex}</TableCell>
                                <TableCell align='left'>{row.rtype}</TableCell>
                                <TableCell align='left'>{row.dtype}</TableCell>
                                <TableCell align='left'>{row.abst}</TableCell>
                                <TableCell align='left'>{row.inc}</TableCell>
                                <TableCell align='left'>{row.out}</TableCell>
                                <TableCell align='left'>{row.balance}</TableCell>
                                <TableCell align='left'>{row.detail}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    render() {
        console.log(this.state);
        const _table = this.createTable();
        return (
            <div>
                {_table}
                <SubmitDialog
                    title='修改记录'
                    open={this.state.ediOpen}
                    onClose={this.updateClose}
                    onSubmit={this.submitUpdate}>
                    <Container>
                        <Grid container direction='column' spacing={2}>
                            <Grid item>                    
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant='inline'
                                        format='yyyy-MM-dd'
                                        margin='normal'
                                        id='date-picker-inline-u'
                                        label='选择生效日期'
                                        value={this.state.datex}
                                        onChange={this.dateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date-u',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="abstract-u"
                                    label="摘要"
                                    value={this.state.abst}
                                    onChange={this.setAbstract}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item>
                                <FormControl>
                                    <InputLabel id='rec-type-label-u'>费用类型</InputLabel>
                                    <Select
                                        label-id='rec-type-label-u'
                                        id='rec-type-u'
                                        value={this.state.rtype}
                                        onChange={this.setRecType}
                                    >
                                        <MenuItem value={1}>管理费用</MenuItem>
                                        <MenuItem value={2}>其他费用</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl>
                                    <InputLabel id='dis-type-label-u'>分摊类型</InputLabel>
                                    <Select
                                        label-id='dis-type-label-u'
                                        id='dis-type-u'
                                        value={this.state.dtype}
                                        onChange={this.setDisType}
                                    >
                                        <MenuItem value={1}>仅23号大院</MenuItem>
                                        <MenuItem value={2}>仅175</MenuItem>
                                        <MenuItem value={3}>23号大院与175(1:2)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl>
                                    <InputLabel htmlFor="income-u">收入</InputLabel>
                                    <Input
                                        id="income-u"
                                        value={this.state.inc}
                                        onChange={this.setIncome}
                                        startAdornment={<InputAdornment position="start">¥</InputAdornment>}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl>
                                    <InputLabel htmlFor="output-u">支出</InputLabel>
                                    <Input
                                        id="output-u"
                                        value={this.state.out}
                                        onChange={this.setOutput}
                                        startAdornment={<InputAdornment position="start">¥</InputAdornment>}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="detail-u"
                                    label="备注"
                                    multiline
                                    rows="4"
                                    value={this.state.detail}
                                    onChange={this.setDetail}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    </Container>
                </SubmitDialog>
            </div>
        );
    }
}