import React from 'react';
import 'date-fns';
import { format } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Button, TableContainer, TableHead } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';

function OKDialog(props) {
    const { onClose, open } = props;

    return (
        <Dialog onClose={onClose} aria-labelledby='dia-title' open={open}>
            <DialogTitle id='dia-title'>保存成功</DialogTitle>
        </Dialog>
    );
}

OKDialog.propTypes = {
    onClose : PropTypes.func.isRequired,
    open : PropTypes.bool.isRequired
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component='div'
            role='tabpanel'
            hidden={value!==index}
            id={`table-tabpanel-${index}`}
            aria-labelledby={`table-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children : PropTypes.node,
    index : PropTypes.any.isRequired,
    value : PropTypes.any.isRequired
}

function quickProp(index) {
    return {
        id : `table-tab-${index}`,
        'aria-controls' : `table-tabpanel-${index}`
    };
}

function createData(rec) {
    return {
        id : rec.pk,
        datex : rec.datex,
        inc : rec.inc,
        out : rec.out,
        detail : rec.detail,
        abst : rec.abst
    };
}

function divideRec(rec, a, b) {
    return {
        pk : rec.pk,
        datex : rec.datex,
        rtype : rec.rtype,
        dtype : 0,
        abst : rec.abst,
        detail : rec.detail,
        inc : rec.inc * 1.0 * a / b,
        out : rec.out * 1.0 * a / b
    };
}

export default class QueryRec extends React.Component {
    constructor(props) {
        super(props);
        var today = new Date();
        this.state = {
            llim : today,
            rlim : today,
            tabv : 0,
            rows : [[],[],[]],
            res : [0, 0, 0],
            open : false
        }
    }

    setllim = (d) => {
        this.setState({llim : d});
    }

    setrlim = (d) => {
        if (d < this.state.llim) {
            this.setState({rlim : this.state.llim});
        } else {
            this.setState({rlim : d});
        }
    }

    handleQuery = (e) => {
        var data = {
            ldate : format(this.state.llim, 'yyyy-MM-dd'),
            rdate : format(this.state.rlim, 'yyyy-MM-dd')
        };
        axios.post('http://127.0.0.1:8000/rec/query/', data).then(resp => {
            var result = resp.data.data;
            console.log(result);
            var all = [];
            var t1 = [];
            var t2 = [];
            var t2_a = [];
            var t1_a = 0;
            var all_a = 0;
            for (var item of result) {
                all.push(createData(item));
                if (item.dtype === 1) {
                    t1.push(createData(item));
                } else if (item.dtype === 2) {
                    t2.push(createData(item));
                } else if (item.dtype === 3) {
                    t1.push(createData(divideRec(item, 1, 3)));
                    t2.push(createData(divideRec(item, 2, 3)));
                }
            }
            for (var item of all) {
                all_a += item.inc;
                all_a -= item.out;
            }
            for (var item of t1) {
                t1_a += item.inc;
                t1_a -= item.out;
            }
            for (var item of t2) {
                t2_a += item.inc;
                t2_a -= item.out;
            }
            this.setState({
                rows : [all, t1, t2],
                res : [all_a, t1_a, t2_a]
            })
        });
    }

    setNewTab = (e, v) => {
        this.setState({tabv : v});
    }

    createTable(tab) {
        return (
            <TableContainer component={Paper}>
                <Table aria-label={`table-${tab}`}>
                    <TableHead>
                        <TableRow>
                            <TableCell>记录标识</TableCell>
                            <TableCell>日期</TableCell>
                            <TableCell>摘要</TableCell>
                            <TableCell>收入</TableCell>
                            <TableCell>支出</TableCell>
                            <TableCell>备注</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.rows[tab].map(row => (
                            <TableRow key={row.id}>
                                <TableCell component='th' scope='row'>{row.id}</TableCell>
                                <TableCell align='left'>{row.datex}</TableCell>
                                <TableCell align='left'>{row.abst}</TableCell>
                                <TableCell align='left'>{row.inc}</TableCell>
                                <TableCell align='left'>{row.out}</TableCell>
                                <TableCell align='left'>{row.detail}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    saveTable = (e) => {
        axios.post('http://127.0.0.1:8000/rec/save/', { data : this.state.rows }).then(resp=>{
            this.setState({
                open : true
            });
        });
    }

    handleSaveSucc = () => {
        this.setState({
            open : false
        });
    }

    render() {
        var cont = this.createTable(this.state.tabv);
        return (
            <div style={{width : '100%'}}>
                <Grid container spacing={2} style={{marginBottom : '1em'}}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container spacing={2}>
                            <Grid item><KeyboardDatePicker
                                disableToolbar
                                variant='inline'
                                format='yyyy-MM-dd'
                                margin='normal'
                                id='llim-picker'
                                label='选择最早生效日期'
                                value={this.state.llim}
                                onChange={this.setllim}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            /></Grid>
                            <Grid item><KeyboardDatePicker
                                disableToolbar
                                variant='inline'
                                format='yyyy-MM-dd'
                                margin='normal'
                                id='rrlim'
                                label='选择最晚生效日期'
                                value={this.state.rlim}
                                onChange={this.setrlim}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            /></Grid>
                        </Grid>
                    </MuiPickersUtilsProvider>
                    <Grid item><Button variant="contained" color="primary" onClick={this.handleQuery}>查询</Button></Grid>
                    <Grid item><Button variant="contained" color="secondary" onClick={this.saveTable}>保存</Button></Grid>
                </Grid>
                <Divider />
                <Typography variant="h6" gutterBottom>总计： ¥ {this.state.res[this.state.tabv]} 元</Typography>
                <Box style={{marginTop : '1em'}}>
                    <AppBar position='static'>
                        <Tabs value={this.state.tabv} onChange={this.setNewTab} aria-label='table'>
                            <Tab label='总账' {...quickProp(0)} />
                            <Tab label='大院分账' {...quickProp(1)} />
                            <Tab label='175分账' {...quickProp(2)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={this.state.tabv} index={0}>{ cont }</TabPanel>
                    <TabPanel value={this.state.tabv} index={1}>{ cont }</TabPanel>
                    <TabPanel value={this.state.tabv} index={2}>{ cont }</TabPanel>
                </Box>
                <OKDialog open={this.state.open} onClose={this.handleSaveSucc} />
            </div>
        );
    }
}