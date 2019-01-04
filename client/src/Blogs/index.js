import React, { Component } from 'react';
import { Panel, Grid, Row, Col, ButtonGroup, Button } from 'react-bootstrap';

import { getBlogs } from './GetBlogs';
import { STATUS_FAILURE, STATUS_SUCCESS, STATUS_LOADING } from '../Network/consts';
import Loadingski from '../Inf/Loadingski';
import {MONTHS} from './blog-consts';
import BlogPage from './BlogPage';
import Timeline from './Timeline';
import moment from 'moment';
import './styles.css';

export const MOBILE_WINDOW_WIDTH = 850;

export default class Blogs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isViewMobile: false,
            networkStatus: null,
            tripId: 'uuid1234',
            blogsArr: null,
            sortBlogsDateDescending: false,
            hasInitiallySorted: false,
            blogShowing: {
                id: '',
                percentage: -1
            }
        };
    }

    componentWillMount() {
        // add a listener for the screen size since we have a mobile view
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    // make sure to remove the listener for the screen size
    // when the component is not mounted anymore
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    handleWindowSizeChange = () => {
        let isMobile = false;
        if (window.innerWidth < MOBILE_WINDOW_WIDTH) {
            isMobile = true;
        }
        this.setState({ isViewMobile: isMobile });
    };

    componentDidMount() {
        this.handleWindowSizeChange();

        this.setState({
            networkStatus: STATUS_LOADING
        }, () => {

            //get list of blogs by trip name from server
            getBlogs(this.state.tripId, (err, data) => {
                if (err) {
                    console.log(err);
                    this.setState({
                        networkStatus: STATUS_FAILURE,
                        getBlogsResults: {
                            status: err.status,
                            message: err.data.message,
                            code: err.data.code
                        }
                    });
                    return;
                }

                this.setState({
                    blogsArr: data,
                    networkStatus: STATUS_SUCCESS
                }, () => {
                    this.sortBlogsByDate(this.state.sortBlogsDateDescending);
                });
            });
        });
    }

    sortBlogsByDate = (shouldDescend) => {
        let sortingHatSwitch = -1;
        if (shouldDescend) {
            sortingHatSwitch = 1;
        }
        let sortedBlogsArr = this.state.blogsArr;

        sortedBlogsArr.sort((trip, nextTrip) => {
            if (trip.date < nextTrip.date) {
                return 1 * sortingHatSwitch;
            }
            if (trip.date > nextTrip.date) {
                return -1 * sortingHatSwitch;
            }
            return 0;
        });

        this.setState({
            blogsArr: sortedBlogsArr,
            sortBlogsDateDescending: shouldDescend,
            hasInitiallySorted: true
        });
    }

    getTimelineLinksInfo = () => {
        let timelineLinkInfo = [];

        //at this point we assume the blogs are sorted in order
        this.state.blogsArr.forEach((nextBlog) => {
            let blogMoment = moment.unix(nextBlog.date);
            let blogMonth = MONTHS[blogMoment.month()];
            let blogDateOfMonth = blogMoment.date();

            let isNextBlogVisible = false;
            if (this.state.blogShowing.id === nextBlog.id) {
                isNextBlogVisible = true;
            }

            timelineLinkInfo.push({
                popoverText: `${blogMonth.substring(0, 3)} ${blogDateOfMonth}`,
                elementId: nextBlog.id,
                isSectionVisible: isNextBlogVisible
            })
        });

        return timelineLinkInfo;
    }

    //renders all paragraphs except the first
    renderSampleBlogItem = (nextBlog) => {
        return (
            <BlogPage
                key={nextBlog.id}
                invisibleAnchorId={nextBlog.id}
                isViewMobile={this.state.isViewMobile}
                blog={nextBlog}
                blogAnchorId={`idForBlogPercentageView-${nextBlog.id}`}
                percentageInViewCallback={(percentageShowing, blogId) => {
                    console.log('percentageInViewCallback for', blogId, ' with amount ', percentageShowing);
                                                
                    //determine which section is most visible and update state with findings
                    if (this.state.blogShowing.id === blogId) {
                        //if we get an id that is already deteremined to be "visible", just update percentage
                        this.setState({
                            blogShowing: {
                                id: blogId,
                                percentage: percentageShowing
                            }
                        });
                    }
                    else if (percentageShowing > this.state.blogShowing.percentage) {
                        //if we get a different id than what is "visible", see if the percentage showing is larger than the "visible", then update with new id and percentage
                        this.setState({
                            blogShowing: {
                                id: blogId,
                                percentage: percentageShowing
                            }
                        });
                    }

                }}
            />
        );
    }

    render() {
        let failureMessageRender = (
            <div className="Blogs">
                <div className="Blogs_error" >
                    <Panel bsStyle="danger">
                        <Panel.Heading>
                            <Panel.Title componentClass="h3">Houston, we have a problem.</Panel.Title>
                        </Panel.Heading>
                        <Panel.Body>
                            <span>
                                <span>Blast! Something went wrong while getting the blogs.</span>
                                <span className="Blogs_error-refresh" >
                                    <Button
                                        onClick={() => { window.location.reload() }}
                                        bsStyle="link"
                                    >
                                        Refresh?
                                    </Button>
                                </span>
                            </span>
                        </Panel.Body>
                    </Panel>
                </div>
            </div>
        );

        let blogsArea = null;

        if (this.state.blogsArr && this.state.hasInitiallySorted) {
            let timelineLinksInfo = this.getTimelineLinksInfo();
    
            //adjust css classes for mobile
            let blogHeaderClass = '';
            if (this.state.isViewMobile) {
                blogHeaderClass = 'Blogs_mobile';
            }
            blogsArea = (
                <div className="Blogs">
                    <Grid>
                        <Row className={`show-grid ${blogHeaderClass}`}>
                            <Col xs={8} md={6}>
                                <div className="blogBrowserTitle">Chile</div>
                            </Col>
                            <Col xs={4} md={6} className="Blogs_controls-wrapper">
                                <div className="Blogs_controls">
                                    <ButtonGroup>
                                        <Button
                                            disabled={!this.state.sortBlogsDateDescending}
                                            onClick={() => {
                                                this.sortBlogsByDate(false);
                                            }}
                                        >
                                            <i className="material-icons navigation-icon-button">
                                                arrow_downward
                                            </i>
                                        </Button>
                                        <Button
                                            disabled={this.state.sortBlogsDateDescending}
                                            onClick={() => {
                                                this.sortBlogsByDate(true);
                                            }}
                                        >
                                            <i className="material-icons navigation-icon-button">
                                                arrow_upward
                                            </i>
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            </Col>
                        </Row>
                        <Row className={blogHeaderClass}>
                            <Col xs={12}>
                                <div className="BlogList">
                                    {this.state.blogsArr.map(this.renderSampleBlogItem)}

                                    <Timeline
                                        linksInfo={timelineLinksInfo}
                                        onTimelineClickedCallback={(indexOfClicked) => {
                                            //delay until transition of movement is over
                                            setTimeout(() => {
                                                console.log('onTimelineClickedCallback for', indexOfClicked, ' with title ', this.state.blogsArr[indexOfClicked].title);
                                                //we can assume this is showing 100%. This will fix itself in the callbacks, but will stop blogs offscreen from taking over with a 0%
                                                this.setState({
                                                    blogShowing: {
                                                        id: this.state.blogsArr[indexOfClicked].id,
                                                        percentage: 100
                                                    }
                                                });
                                            }, 700);
                                        }}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </div >
            );
        }
        return (
            <div>
                {this.state.networkStatus === STATUS_LOADING && <Loadingski />}
                {this.state.networkStatus === STATUS_SUCCESS && blogsArea}
                {this.state.networkStatus === STATUS_FAILURE && failureMessageRender}
            </div>
        );

    }

}