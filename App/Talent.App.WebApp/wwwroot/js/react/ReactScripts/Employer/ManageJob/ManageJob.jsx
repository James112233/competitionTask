import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Button, Card, Label } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            jobDetails: [],
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.handlePageChanged = this.handlePageChanged.bind(this);
        this.onClickCloseJobs = this.onClickCloseJobs.bind(this);
        //your functions go here
    };

    init() {
        this.loadData(() =>
            this.setState({ loaderData }),
            loaderData.isLoading = false,
        )
    }

    handlePageChanged  (e, { activePage }) {
        const page = activePage;
        console.log("activePage: ", page);
        this.setState({ activePage: page }, () => this.loadData(() =>
            this.setState({ loaderData }),
            loaderData.isLoading = false)
        );
    };

    onClickCloseJobs(e, { key }) {
        const buttonKey = key;
        console.log("key:", buttonKey);
    };

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        var link = 'http://talentlistingservices.azurewebsites.net/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
           url: link,
           headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            data: {
                activePage: this.state.activePage,
                sortbyDate: this.state.sortBy.date,
                showActive: this.state.filter.showActive,
                showClosed: this.state.filter.showClosed,
                showDraft: this.state.filter.showDraft,
                showExpired: this.state.filter.showExpired,
                showUnexpired: this.state.filter.showUnexpired,
            },
            success: function (res) {
                if (res.myJobs) {
                    this.state.jobDetails = res.myJobs
                    this.setState({ totalPages: Math.ceil(res.totalCount / 6) })
                } else {
                    console.log("Nothing", res)
                }
                console.log("myJobs:", this.state.jobDetails);
                console.log("data:", res);
                callback();
                //this.updateWithoutSave(employerData)
            }.bind(this),
            error: function (res) {
                console.log(res.status);
                callback();
            }
        })
    }
    

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    render() {
        let list = this.state.jobDetails;
        let cardData = null;
        var currentDate = new Date();        
        if (list != "") {
            
            cardData = list.map(card =>
                <Card key={card.id}>
                    <Card.Content>
                        <Card.Header>{card.title}</Card.Header>
                        <Label color='black' ribbon='right'><Icon name='user' />0</Label>
                        <Card.Meta>{card.location.city}, {card.location.country}</Card.Meta>
                        <Card.Description>{card.summary}</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <span className='left floated'>
                            {card.expiryData > currentDate.toISOString() ?
                                <Label color='red'>Expired</Label>
                                :
                                <Label color='blue'>Unexpired</Label>
                            }
                        </span>
                        <span className='right floated'>
                            <div className='ui three buttons'>
                                <Button key={card.id} basic color='blue' onClick={this.onClickCloseJobs} >Close</Button>
                                <Button basic color='blue'>Edit</Button>
                                <Button basic color='blue'>Copy</Button>
                            </div>
                        </span>
                    </Card.Content>
                </Card>
            )
        }
        else {
            cardData = "No Jobs Found";
        }
        const filterOptions = [
            { key: 'all', text: 'All', value: 'all' },
            { key: 'active', text: 'Active', value: 'active' },
            { key: 'closed', text: 'Closed', value: 'closed' },
            { key: 'draft', text: 'Draft', value: 'draft' },
            { key: 'expired', text: 'Expired', value: 'expired' },
            { key: 'unexpired', text: 'Unexpired', value: 'unexpired' },
        ]
        const sortOptions = [
            { key: 'newest', text: 'Newest first', value: 'newest' },
            { key: 'oldest', text: 'Oldest first', value: 'oldest' },
        ]

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <h1>List of Jobs</h1>
                    <div>
                        <span>
                            <Icon name='filter' />
                            Filter:
                            <Dropdown placeholder='Choose Filter' inline options={filterOptions} />
                        </span>
                        <span>
                            <Icon name='alternate outline calendar' />
                            Sort by Date:
                            <Dropdown inline options={sortOptions} defaultValue={sortOptions[0].value} />
                        </span>
                    </div>
                    <br />
                    <div className="ui two cards">
                        {cardData}
                    </div>
                    <br />
                    <div align='center'>

                        <Pagination activePage={this.state.activePage} totalPages={this.state.totalPages} onPageChange={this.handlePageChanged}  />
                    </div>
                    <br />
                </div>
            </BodyWrapper>
        )
    }
}