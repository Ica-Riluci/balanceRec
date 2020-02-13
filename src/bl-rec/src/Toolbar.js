import 'date-fns';
import axios from 'axios';
import { format } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import React from 'react';
import {
    Grid,
    FormControl, FormLabel, FormControlLabel,
    RadioGroup, Radio, Button, Dialog, DialogTitle, DialogActions, Container, TextField, InputLabel, Select, MenuItem, Input, InputAdornment
} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import PropTypes from 'prop-types';

axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';

function SubmitDialog(props) {
    const { children, title, open, onClose, onSubmit, ...others } = props;

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby='dia-title'>
            <DialogTitle id={title}>{title}</DialogTitle>
            {children}
            <DialogActions>
                <Button autoFocus color='primary' onClick={onSubmit}>添加新纪录</Button>
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

export default class Toolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            insOpen : false,
            sel_date : new Date(),
            rec_type : 1,
            dis_type : 3,
            abst : '',
            inc : 0.0,
            out : 0.0,
            detail : '',
            _sel_date : new Date(),
            _rec_type : 1,
            _dis_type : 3,
            _abst : '',
            _inc : 0.0,
            _out : 0.0,
            _detail : ''
        }
    }

    addRecOpen = (e) => {
        this.setState({
            insOpen : true
        });
    }

    addRecClose = (e) => {
        this.setState({
            insOpen : false
        });
    }

    submitAddRec = (e) => {
        console.log('submit');
        var data = {
            datex : format(this.state.sel_date, 'yyyy-MM-dd'),
            abst : this.state.abst,
            type : this.state.rec_type,
            dist : this.state.dis_type,
            inc : this.state.inc,
            out : this.state.out,
            detail : this.state.detail
        };
        axios.post('http://127.0.0.1:8000/rec/add/', data).then(resp => {
            console.log(resp);
            this.setState({
                insOpen : false
            });
            this.props.queryAll();
        });
    }

    dateChange = (v) => {
        this.setState({
            sel_date : v
        })
    }

    setAbstract = (e) => {
        this.setState({
            abst : e.target.value
        });
    }

    setRecType = (e) => {
        this.setState({
            rec_type : e.target.value
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
            dis_type : e.target.value
        });
    }

    render() {
        return (
            <div>
                <Grid container direction='column' spacing={2}>
                    <Grid item>
                        <Grid container direction='row' spacing={2}>
                            <Grid item><Button variant='contained' color='primary' onClick={this.addRecOpen}>增加</Button></Grid>
                            <Grid item><Button variant='contained' color='primary' onClick={this.props.saveRec}>保存</Button></Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction='row'>
                            <Grid item>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid container spacing={2}>
                                        <Grid item>
                                            <KeyboardDatePicker
                                                disableToolbar
                                                variant='inline'
                                                format='yyyy-MM-dd'
                                                margin='normal'
                                                id='ldate-set'
                                                label='选择最早生效日期'
                                                value={this.props.ldate}
                                                onChange={this.props.setLDate}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />     
                                        </Grid>                           
                                        <Grid item>
                                            <KeyboardDatePicker
                                                disableToolbar
                                                variant='inline'
                                                format='yyyy-MM-dd'
                                                margin='normal'
                                                id='rdate-set'
                                                label='选择最迟生效日期'
                                                value={this.props.rdate}
                                                onChange={this.props.setRDate}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>
                        <Grid container direction='row' spacing={2}>
                            <Grid item>
                                <Button color='primary' variant='contained' onClick={this.props.queryRange}>筛选一定时间范围内记录</Button>
                            </Grid>
                            <Grid item>
                                <Button color='primary' variant='contained' onClick={this.props.queryAll}>检索所有记录</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <FormControl component='fieldset'>
                            <FormLabel component='legend'>选择子表</FormLabel>
                            <RadioGroup row aria-label='table' name='table' value={this.props.tableID} onChange={this.props.tableSelect}>
                                <FormControlLabel
                                    value='0'
                                    control={<Radio color='primary' />}
                                    label='总账'
                                />
                                <FormControlLabel
                                    value='1'
                                    control={<Radio color='primary' />}
                                    label='仅23号大院'
                                />
                                <FormControlLabel
                                    value='2'
                                    control={<Radio color='primary' />}
                                    label='仅175'
                                />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
                <SubmitDialog
                    title='添加新的记录'
                    open={this.state.insOpen}
                    onClose={this.addRecClose}
                    onSubmit={this.submitAddRec}>
                    <Container>
                        <Grid container direction='column' spacing={2}>
                            <Grid item>                    
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant='inline'
                                        format='yyyy-MM-dd'
                                        margin='normal'
                                        id='date-picker-inline'
                                        label='选择生效日期'
                                        value={this.state.sel_date}
                                        onChange={this.dateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="abstract"
                                    label="摘要"
                                    value={this.state.abst}
                                    onChange={this.setAbstract}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item>
                                <FormControl>
                                    <InputLabel id='rec-type-label'>费用类型</InputLabel>
                                    <Select
                                        label-id='rec-type-label'
                                        id='rec-type'
                                        value={this.state.rec_type}
                                        onChange={this.setRecType}
                                    >
                                        <MenuItem value={1}>管理费用</MenuItem>
                                        <MenuItem value={2}>其他费用</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl>
                                    <InputLabel id='dis-type-label'>分摊类型</InputLabel>
                                    <Select
                                        label-id='dis-type-label'
                                        id='dis-type'
                                        value={this.state.dis_type}
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
                                    <InputLabel htmlFor="income">收入</InputLabel>
                                    <Input
                                        id="income"
                                        value={this.state.inc}
                                        onChange={this.setIncome}
                                        startAdornment={<InputAdornment position="start">¥</InputAdornment>}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl>
                                    <InputLabel htmlFor="output">支出</InputLabel>
                                    <Input
                                        id="output"
                                        value={this.state.out}
                                        onChange={this.setOutput}
                                        startAdornment={<InputAdornment position="start">¥</InputAdornment>}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="detail"
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
        )
    }
}