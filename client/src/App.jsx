import React, { Component } from 'react';
import {TabView,TabPanel} from 'primereact/components/tabview/TabView';
import { withRouter } from 'react-router-dom'

import FileEditor from './FileEditor.jsx';
import Configuration from './Configuration.jsx';
import About from './About.jsx';


class App extends Component {
    state = {activeIndex: 1};

    tabs = [
        {name: 'File editor', component: FileEditor, icon: 'fa-edit'},
        {name: 'Configuration', component: Configuration, icon: 'fa-gear'},
        {name: 'About', component: About, icon: 'fa-info'},
    ];

    componentDidMount() {
        this.openTab();
    }

    openTab() {
        const { match } = this.props;
        if (match.params && match.params.tab) {
            this.setState({activeIndex: this.tabs.findIndex(tab => tab.name === match.params.tab)});
        }
    }

    onTabChange(i) {
        const { history } = this.props;
        history.push(`/${this.tabs[i.index].name}`);
        this.setState({activeIndex: i.index});
    }

    render() {
        return (
            <div>
                <div className="ui-g">
                    <div className="ui-g-12 ui-g-nopad">
                        <div className="ui-g-12">
                            <TabView onTabChange={this.onTabChange.bind(this)} activeIndex={this.state.activeIndex}>
                                {this.tabs.map(tab => {
                                    return (
                                        <TabPanel key={tab.name} header={tab.name} leftIcon={tab.icon}><tab.component /></TabPanel>
                                    );
                                })}
                            </TabView>
                        </div>
                    </div>
                    <div className="ui-g-12" style={{textAlign: 'right'}}>
                        <a href="https://github.com/dachinat/react-intl-server" target="_blank">dachinat/react-intl-server</a>
                    </div>
                </div>
            </div>
        );
    }
}
export default withRouter(App);

