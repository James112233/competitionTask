import React from 'react';
import Cookies from 'js-cookie';
import { Popup, Card, Button, Icon, Grid, Label, Segment } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
    }

    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        //url: 'http://localhost:51689/listing/listing/closeJob',
    };

    render() {
        
    }
}