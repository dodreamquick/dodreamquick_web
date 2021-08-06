import React from "react"
import {Helmet} from "react-helmet/es/Helmet";
import {connect} from "react-redux";
import styles from "../app.module.css";
import {baseURL} from "../apis/config";
import {getNews} from "../apis/api";
import NewsListView from "../components/NewsListView";

const ReactGA = require('react-ga');

class About extends React.Component {

    state = {
        selectedTab: 0,
        news_list: [],
    }

    on_click_tab = index => {
        this.setState(prevState => ({
            ...prevState,
            selectedTab: index
        }))
    }

    async componentDidMount() {
        ReactGA.initialize('UA-158814088-1');
        ReactGA.pageview(window.location.pathname + window.location.search);

        const news_list = await getNews()
        this.setState({news_list})
    }

    render() {
        return (
            <div>
                <div>
                    <Helmet>
                        <title>두드림퀵: 회사소개</title>
                        <meta
                            name="description"
                            content="두드림퀵 회사소개"/>
                        <link rel="canonical" href="https://dodreamquick.com/about"/>
                    </Helmet>
                </div>
                <div className={styles.introTableTabs}>
                    <div
                        onClick={() => this.on_click_tab(0)}
                        className={[styles.introTableTab, this.state.selectedTab === 0 && styles.active].join(' ')}
                    >
                        두드림퀵 소개
                    </div>
                    <div
                        onClick={() => this.on_click_tab(1)}
                        className={[styles.introTableTab, this.state.selectedTab === 1 && styles.active].join(' ')}
                    >
                        언론보도
                    </div>
                </div>
                {
                    this.state.selectedTab === 0
                        ? (
                            <div className={[styles.contentContainer, styles.aboutContainer].join(' ')}>
                                {this.props.setting ? <img className={styles.aboutImg} src={`${baseURL}${this.props.setting.about_company_image}`}
                                                 alt="두드림퀵 지하철 퀵서비스 회사소개"/> : null}
                            </div>
                        )
                        : (
                            <div className={styles.contentContainer}>
                                <NewsListView news_list={this.state.news_list}/>
                            </div>
                        )
                }
            </div>
        )
    }
}


const mapStateToProps = state => ({...state.common, ...state.user})

export default connect(mapStateToProps)(About)
