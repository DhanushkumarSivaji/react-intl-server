import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import {Message} from 'primereact/components/message/Message';
import {Messages} from 'primereact/components/messages/Messages';
import {Growl} from 'primereact/components/growl/Growl';
import {Tree} from 'primereact/components/tree/Tree';
import {Panel} from 'primereact/components/panel/Panel';
import {InputText} from 'primereact/components/inputtext/InputText';

class FileEditor extends Component {
    status = {};
    state = {error: null, files: null, selectedNode: null, json: null, value: {} };

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
            this.setState({files: this.makeTreeData(data)});
        } catch (e) {
            this.setState({error: 'Network error occurred'});
            this.messages.show({ severity: 'error', summary: this.state.error, detail: 'An error occurred',
                life: 3600 * 24 * 30, closable: false });
        }
    }

    makeTreeData(files) {
        const changeTree = arr => {
            
            arr.forEach(i => {
                if (i.children) {
                    i.label = i.name;
                    i.data = i.name + ' dir';
                    i.expandedIcon = 'fa-folder-open';
                    i.collapsedIcon = 'fa-folder';
                    i.expanded = true;

                    return changeTree(i.children);
                }

                i.data = i.name + 'file';
                i.icon = 'fa-file-text-o';
                i.label = i.name;
            });
            
        };

        changeTree([files]);

        return [files];
    }

    handleNodeSelect(e) {
        const { content } = e.selection;

        if (!e.selection.extension) return;

        try {
            Object.keys(this.status).forEach(el => { try { this.status[el].innerHTML = ''; } catch (e) { } });
            this.setState({selectedNode: e.selection, json: JSON.parse(content), value: {}});
        } catch(e) {
            this.setState({error: 'Could not parse file to JSON'}, () => {
                this.messages.show({ severity: 'error', summary: this.state.error,
                    detail: e.message, life: 3600 * 24 * 30, closable: false });
            });
        }
    }

    async updateTranslation(key, value) {
        const { path } = this.state.selectedNode;

        try {
            const {data} = await axios.patch('/updateTranslation', { path, key, value});

            if (!data) {
                this.status[key].innerHTML = '<i class="fa fa-close"></i>';
                return;
            }

            const arr = this.state.files;
            const updateByPath = arr => {
                arr.forEach(i => {
                    if (i.children) return updateByPath(i.children);
                    if (i.path && i.path === path) {
                        i.content = JSON.stringify(data);
                    }
                });
            };
            updateByPath(arr);

            this.setState({files: null, filesTmp: arr}, () => {
                this.setState({files: this.makeTreeData(this.state.filesTmp[0]), filesTmp: undefined});
            });


            this.status[key].innerHTML = '<i class="fa fa-check"></i>';
        } catch(e) {
            this.status[key].innerHTML = '<i class="fa fa-close"></i>';
            this.growl.show({ severity: 'error', summary: e.message, detail: 'An error occurred' });
        }
    }

    renderEditing() {
        if (!this.state.json) return <div>Select a file from tree view</div>;

        let json = this.state.json;
        let editing;

        if (Array.isArray(json)) {
            json = JSON.stringify(json);
            editing = (
                <Panel header={this.state.selectedNode.name}>
                    <Message severity="warn" text="Unsupported JSON format. Should be a key/value pair object."></Message>
                </Panel>
            );
        } else if (typeof json === 'object') {
            editing = Object.keys(json).map(key => {
                const oldValue = json[key];
                return (
                    <div key={key} style={{marginBottom: '20px'}}>

                        <Panel header={key}>
                            <div style={{marginBottom: '10px'}}>
                                {json[key]}
                            </div>
                            <InputText value={typeof this.state.value[key] !== 'undefined' ? this.state.value[key] : json[key]} style={{width: '90%'}}
                                onChange={e => {
                                    this.setState({value: { ...this.state.value, [key]: e.target.value } });
                                    this.status[key].innerHTML = '';
                                }} onBlur={e => {
                                    if (oldValue !== e.target.value) {
                                        this.updateTranslation(key, e.target.value, e.target)
                                    }}} />
                            <span ref={el => {this.status[key] = el}} style={{marginLeft: '15px', color:'#375071'}}></span>
                        </Panel>
                    </div>
                );
            });
        }

        return editing;

        //<Panel header="tmp">
        //    {this.state.selectedNode.content}
        //</Panel>
    }

    render() {
        if (this.state.error) {
            return <Messages ref={(el) => { this.messages = el; }}></Messages>;
        }

        return (
            <div>

                <div className="ui-g">
                    <div className="ui-g-12 ui-lg-4">
                        <div>
                            {!this.state.files ? null : (
                                <Tree value={this.state.files} selectionMode="single"
                                      selection={this.state.selectedNode} selectionChange={this.handleNodeSelect.bind(this)} />
                            )}
                        </div>
                    </div>
                    <div className="ui-g-12 ui-lg-8">
                        <div>
                            {this.renderEditing()}
                        </div>
                    </div>
                </div>

                <Growl ref={(el) => { this.growl = el; }}></Growl>
            </div>
        );
    }
}

export default FileEditor;