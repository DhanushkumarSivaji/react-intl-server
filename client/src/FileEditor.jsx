import React, { Component } from 'react';
import axios from 'axios';
import {Message} from 'primereact/components/message/Message';
import {Messages} from 'primereact/components/messages/Messages';
import {Growl} from 'primereact/components/growl/Growl';
import {Tree} from 'primereact/components/tree/Tree';

class FileEditor extends Component {
    state = {error: null, files: null, selectedNode: null };

    componentDidMount() {
        this.fetchFiles();
    }

    async fetchFiles() {
        try {
            const {data} = await axios.get('/fetchFiles');
            if (!data) {
                this.setState({error: 'Could not fetch files'});
                return this.messages.show({ severity: 'error', summary: this.state.error, detail: 'An error occurred',
                    life: 3600 * 24 * 30, closable: false });
            }
            this.setState({files: data});
        } catch (e) {
            this.setState({error: 'Network error occurred'});
            this.messages.show({ severity: 'error', summary: this.state.error, detail: 'An error occurred',
                life: 3600 * 24 * 30, closable: false });
        }
    }

    makeTreeData() {
        let { files } = this.state;

        if (!files) return;

        const changeTree = arr => {
            
            arr.forEach(i => {
                if (i.children) {
                    i.label = i.name;
                    i.data = i.name + ' dir';
                    i.expandedIcon = 'fa-folder-open';
                    i.collapsedIcon = 'fa-folder';

                    return changeTree(i.children);
                }

                i.content = i.data;
                delete i.data;
                i.icon = 'fa-file-text-o';
                i.label = i.name;
            });
            
        };

        changeTree([files]);

        return [files];
    }

    handleNodeSelect(e, node) {
        this.setState({selectedNode: e.selection});
    }

    render() {
        if (this.state.error) {
            return <Messages ref={(el) => { this.messages = el; }}></Messages>;
        }

        return (
            <div>
                <Tree value={this.makeTreeData()} selectionMode="single"
                      selection={this.state.selectedNode} selectionChange={this.handleNodeSelect.bind(this)} />
                <Growl ref={(el) => { this.growl = el; }}></Growl>
            </div>
        );
    }
}

export default FileEditor;