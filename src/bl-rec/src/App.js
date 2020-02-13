import React from 'react';
import { format } from 'date-fns';
import Toolbar from './Toolbar';
import {
    Container, Divider
} from '@material-ui/core';
import DataViewport from './DataViewport';

import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';

const Dtype = ['','仅23号大院','仅175','23号大院和175'];
const Rtype = ['', '管理费用', '其他费用']
const Filename = {
    '0' : '总账',
    '1' : '23号大院',
    '2' : '175'
};

function produceRow(rec, base, type, a, b) {
    var ret = {
        id : rec.id,
        datex : rec.datex,
        rtype : Rtype[rec.rtype],
        dtype : type ? Dtype[type] : Dtype[rec.dtype],
        abst : rec.abst,
        inc : rec.inc * a / b,
        out : rec.out * a / b,
        balance : base + rec.inc * a/ b + rec.out * a / b,
        detail : rec.detail
    };
    return ret;
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tid : '0',
            ldate : new Date(),
            rdate : new Date(),
            rows : {
                '0' : [],
                '1' : [],
                '2' : []
            }
        };
        this.queryAll();
    }

    changeTable = (e) => {
        this.setState({
            tid : e.target.value
        });
    }

    setldate = (v) => {
        this.setState({
            ldate : v
        });
    }

    setrdate = (v) => {
        console.log(v);
        if (v < this.state.ldate) {
            this.setState({rdate : this.state.ldate});
        } else {
            this.setState({rdate : v});
        }
    }

    setRows(raw) {
        var balance = [0.0, 0.0, 0.0];
        var rows = [[], [], []];
        for (var rec of raw) {
            var item0 = produceRow(rec, balance[0], 0, 1.0, 1.0);
            rows[0].push(item0);
            balance[0] = item0.balance;
            var item1, item2;
            if (rec.dtype !== 2) {
                item1 = rec.dtype === 1 ? produceRow(rec, balance[1], 1, 1.0, 1.0) :
                        produceRow(rec, balance[1], 1, 1.0, 3.0);
                balance[1] = item1.balance;
                rows[1].push(item1);
            }
            if (rec.dtype !== 1) {
                item2 = rec.dtype === 2 ? produceRow(rec, balance[2], 2, 1.0, 1.0) :
                        produceRow(rec, balance[2], 2, 2.0, 3.0);
                balance[2] = item2.balance;
                rows[2].push(item2);
            }
        }
        this.setState({
            rows : rows
        });
    }

    queryAll = (e) => {
        axios.post('http://127.0.0.1:8000/rec/retrieve/').then(resp => {
            var result = resp.data.data;
            this.setRows(result);
        })
    }

    queryRange = (e) => {
        axios.post('http://127.0.0.1:8000/rec/query/', {
            ldate : format(this.state.ldate, 'yyyy-MM-dd'),
            rdate : format(this.state.rdate, 'yyyy-MM-dd')
        }).then(resp=>{
            var result = resp.data.data;
            this.setRows(result);
        })
    }

    deleteSelected = (id) => {
        console.log('id', id);
        axios.post('http://127.0.0.1:8000/rec/delete/', {todel:[id]}).then(resp => {
            this.queryAll();
        });
    }

    updateSelected = (data) => {}

    saveRec = (e) => {
        axios.post('http://127.0.0.1:8000/rec/save/',{
            data : this.state.rows[this.state.tid],
            filename : Filename[this.state.tid] + '.csv'
        });
    }

    render() {
        console.log(this.state.rows);
        return (
            <Container>
                <Toolbar
                    tableID={this.state.tid}
                    tableSelect={this.changeTable}
                    ldate={this.state.ldate}
                    rdate={this.state.rdate}
                    setLDate={this.setldate}
                    setRDate={this.setrdate}
                    queryAll={this.queryAll}
                    queryRange={this.queryRange}
                    saveRec={this.saveRec}
                />
                <Divider />
                <DataViewport
                    data={this.state.rows[this.state.tid]}
                    tab={this.state.tid}
                    deleteAction={this.deleteSelected}
                    queryAll={this.queryAll}
                />
            </Container>
        );
    }
}

export default App;
