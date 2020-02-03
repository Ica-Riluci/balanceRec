import 'date-fns';
import { format } from 'date-fns';
import { styled } from '@material-ui/core/styles';
import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Container from '@material-ui/core/Container';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default class AddRec extends React.Component{
    constructor(props) {
        super(props);
        const today = new Date();
        this.state = {
            sel_date : today,
            rec_type : 1,
            dis_type : 3,
            inc : 0.0,
            out : 0.0,
            detail : ''
        };
    }

    handleDateChange = (date) => {
        this.setState({
            sel_date : date
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
    
    handleSubmit = (e) => {
        console.log(format(this.state.sel_date, 'yyyy-MM-dd'));
        var data = {
            datex : format(this.state.sel_date, 'yyyy-MM-dd'),
            type : this.state.rec_type,
            dist : this.state.dis_type,
            inc : this.state.inc,
            out : this.state.out,
            detail : this.state.detail   
        };
        axios.post('http://127.0.0.1:8000/rec/add/', data).then(resp => {
            console.log(resp);
        });
    }

    render() {
        return (
            <div>
                <Grid container>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant='inline'
                            format='yyyy-MM-dd'
                            margin='normal'
                            id='date-picker-inline'
                            label='选择生效日期'
                            value={this.state.sel_date}
                            onChange={this.handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid container>
                    <Grid container direction='row' spacing={2}>
                        <Grid item><FormControl>
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
                        </FormControl></Grid>
                        <Grid item><FormControl>
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
                        </FormControl></Grid>
                        <Grid item><FormControl>
                            <InputLabel htmlFor="income">收入</InputLabel>
                            <Input
                                id="income"
                                value={this.state.inc}
                                onChange={this.setIncome}
                                startAdornment={<InputAdornment position="start">¥</InputAdornment>}
                            />
                        </FormControl></Grid>
                        <Grid item><FormControl>
                            <InputLabel htmlFor="output">支出</InputLabel>
                            <Input
                                id="output"
                                value={this.state.out}
                                onChange={this.setOutput}
                                startAdornment={<InputAdornment position="start">¥</InputAdornment>}
                            />
                        </FormControl></Grid>
                    </Grid>
                </Grid>
                <div style={{marginTop : '1em'}}><Grid container>
                    <TextField
                        id="detail"
                        label="备注"
                        multiline
                        rows="4"
                        value={this.state.detail}
                        onChange={this.setDetail}
                        variant="outlined"
                    />
                </Grid></div>
                <div style={{marginTop : '1em'}}>
                    <Grid container><Button variant="contained" color="primary" onClick={this.handleSubmit}>提交新的记录</Button></Grid>
                </div>
            </div>
        );
    }
};