import React from 'react';
import Cookies from 'js-cookie';
import { Popup, Card } from 'semantic-ui-react';
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
        return (
            <div>
                <Card.Group centered itemsPerRow={3}>
                    {
                        this.props.jobDetails.map((job) =>
                            <Card key={job.id} width={5}>
                                <Card.Content>
                                    <Card.Header>{job.title}</Card.Header>
                                    <Card.Meta>{job.location.city}  {job.location.country}</Card.Meta>
                                    <Card.Description>{job.summary}</Card.Description>
                                </Card.Content>
                            
                            </Card>
                )
            }
                </Card.Group>
            </div>
        );
    }
}