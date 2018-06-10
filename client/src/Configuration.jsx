import React, { Component, Fragment } from 'react';
import { reduxForm, Field } from 'redux-form';
import axios from 'axios';
import {Fieldset} from 'primereact/components/fieldset/Fieldset';
import {InputText} from 'primereact/components/inputtext/InputText';
import {Button} from 'primereact/components/button/Button';
import {Message} from 'primereact/components/message/Message';
import {Growl} from 'primereact/components/growl/Growl';

class Configuration extends Component {
    config = null;

    componentDidMount() {
        this.fetchConfiguration();
    }

    async fetchConfiguration() {
        const { change } = this.props;
        try {
            const {data} = await axios.get('./config');
            if (data) {
                this.config = data;
                Object.keys(data).forEach(key => change(key, data[key]));
            } else {
                this.growl.show({ severity: 'error', summary: 'Could not fetch configuration', detail: 'An error occurred'});
            }
        } catch (e) {
            this.growl.show({ severity: 'error', summary: e.message, detail: 'An error occurred'});
        }
    }

    renderField({meta: {error, touched}, input}) {
        return (
            <Fragment>
                <InputText {...input} placeholder="i.e.: /var/project1/intl" size="30" />
                {error && touched ? (
                    <div style={{marginTop: '5px'}}><Message severity="error" text={error} /></div>
                ) : null}
            </Fragment>
        );
    }

    async handleSubmit(values) {
        try {
            const {data} = await axios.put('/config', {...values});
            if (data.ok) {
                return this.growl.show({ severity: 'info ', summary: 'Config updated', detail: 'Action processed'});
            }
            this.growl.show({ severity: 'error', summary: 'Could not write configuration', detail: 'An error occurred'});
        } catch (e) {
            this.growl.show({ severity: 'error', summary: e.message, detail: 'An error occurred' });
        }
    }

    render() {
        const { handleSubmit } = this.props;

        return (
            <div>
                <form onSubmit={handleSubmit(this.handleSubmit.bind(this))}>
                    <Fieldset legend="Path to translations directory">
                        <Field name="translationsDir" component={this.renderField} />
                    </Fieldset>

                    <div style={{marginTop: '20px'}}>
                        <Button>Save</Button>
                    </div>
                </form>
                <Growl ref={(el) => { this.growl = el; }}></Growl>
            </div>
        );
    }
}

export default reduxForm({
    form: 'configuration',
    validate: values => {
        const errors = [];
        if (!values.translationsDir) errors.translationsDir = 'You need to point to translations directory';
        return errors;
    }
})(Configuration);