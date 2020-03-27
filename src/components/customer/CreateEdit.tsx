import * as React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ButtonSave from '../ui/ButtonSave'
const webApi = require('../../api')

interface IProps { }

interface ICustomer {
    customerId: number
    firstname: string
    lastname: string
}

interface ICustomerState {
    customer: ICustomer,
    isSaving: boolean
}

export default class CreateEditCustomer extends React.Component<IProps, ICustomerState> {
    state: ICustomerState

    constructor(props: any) {
        super(props)

        this.state = {
            customer: {
                customerId: 0,
                firstname: '',
                lastname: ''
            },
            isSaving: false
        }

        this.getCustomerById(props.match.params.customerId)
    }

    submit = () => {
        this.setState({ isSaving: true })
        const customerId = this.state.customer.customerId
        if (customerId !== 0) {
            axios.put(`${webApi.baseApiUrl}customers/${customerId}`, this.state.customer).then(response => {
                alert(response.data)
            }).catch(error => {
                console.log(error)
            }).then(() => {
                this.setState({ isSaving: false })
            })
        } else {
            axios.post(`${webApi.baseApiUrl}customers`, this.state.customer).then(response => {
                alert(response.data)
            }).catch(error => {
                console.log(error)
            }).then(() => {
                this.setState({ isSaving: false })
            })
        }
    }

    getCustomerById(id: number): void {
        if (id) {
            axios.get(`${webApi.baseApiUrl}customers/${id}`).then(response => {
                this.setState({
                    customer: response.data
                })
            }).catch(error => {
                alert(error.response.data)
            })
        }
    }

    handleInputChanges = (e: any) => {
        let currentCustomerState = { ...this.state.customer }
        currentCustomerState.firstname = e.target.value
        currentCustomerState.lastname = e.target.value
        this.setState({ customer: currentCustomerState });
    }

    render() {
        return (
            <div>
                <h3 className="title is-3">{this.state.customer.customerId != 0 ? 'Edit' : 'Create'} customer</h3>
                <div className="columns">
                    <div className="column">
                        <div className="field">
                            <label className="label">Firstname</label>
                            <div className="control">
                                <input value={this.state.customer.firstname || ''} onChange={(e) => this.handleInputChanges(e)} type="text" className="input" />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Lastname</label>
                            <div className="control">
                                <input value={this.state.customer.lastname || ''} onChange={(e) => this.handleInputChanges(e)} type="text" className="input" />
                            </div>
                        </div>
                    </div>
                    <div className="column"></div>
                </div>
                <div className="level">
                    <div className="level-left">
                        <ButtonSave isSaving={this.state.isSaving} triggerParent={this.submit} />
                        &nbsp;
                        <Link to={'/customers'} className="button">Go back</Link>
                    </div>
                    <div className="level-right"></div>
                </div>
            </div>
        )
    }
}