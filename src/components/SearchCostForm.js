import React from 'react'
import Form from "react-bootstrap/Form";
import PostCodeForm from "./PostCodeForm";
import {getLocationList, getOrderPrices} from "../apis/api";
import Table from 'react-bootstrap/Table'
import styles from '../app.module.css'

const ReactGA = require('react-ga');

const SelectLocationForm = props => {

    const options = props.location_list.map(
        location => (<option value={location.name} key={location.id}>{location.name}</option>)
    )

    return (
        <select onChange={event => props.select_location(event.target.value)}>
            <option value="default" key={0}>주소 선택</option>
            {options}
        </select>
    )
}


class SearchCostForm extends React.Component {

    state = {
        location_list: [],
        selected_departure_location: "",
        selected_arrival_location: "",
        //prices: null,

        sender_address: '',
        receiver_address: '',

        sender_address_finder: false,
        receiver_address_finder: false,

        prices: {
            default: 0,
            addition: 0,
            discount: 0,
            total: 0
        },
    }

    async componentDidMount() {

        ReactGA.initialize('UA-158814088-1');
        ReactGA.pageview(window.location.pathname+window.location.search);

        const location_list = await getLocationList()
        const location_list_sorted = location_list.sort(
            (a, b) => (a.id < b.id) ? -1 : 1
        )
        this.setState({location_list: location_list_sorted})
        console.log(this.state.location_list)
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.selected_departure_location !== this.state.selected_departure_location ||
        prevState.selected_arrival_location !== this.state.selected_arrival_location) {
            await this.search_prices()
        }
        if (prevState.sender_address !== this.state.sender_address ||
            prevState.receiver_address !== this.state.receiver_address) {
            await this.update_order_price()
        }
        
    }

    update_order_price = async () => {
        const prices = await getOrderPrices(this.state.sender_address, this.state.receiver_address)
        this.setState({prices})
    }

    

    select_location = key => value => {
        this.setState({[key]: value})
    }

    search_prices = async () => {
        const prices = await getOrderPrices(this.state.selected_departure_location, this.state.selected_arrival_location)
        this.setState({prices})
    }

    on_complete_search = key => address => {
        this.setState({
            [key]: address,
            [key + "_detail"]: "",
            [key + "_finder"]: false,
        })
    }

    render() {
        return (
            <div>
                <div className={styles.searchCostForm}>
                    <div className={styles.searchCostFormLabel}>
                        <div className={styles.searchCostFormLabelTitle}>
                            배송 요금 조회
                        </div>
                        <div className={styles.searchCostFormLabelDescription}>
                            픽업지와 배송지의 지역구를 선택해주세요.
                        </div>
                    </div>

                    <Table>
                        <thead>
                        <tr>
                            <th>픽업지</th>
                            <th>배송지</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <div>
                                    <SelectLocationForm
                                        location_list={this.state.location_list}
                                        select_location={this.select_location("selected_departure_location")} />
                                </div>

                            </td>
                            <td>
                                <SelectLocationForm
                                    location_list={this.state.location_list}
                                    select_location={this.select_location("selected_arrival_location")} />
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                </div>


                <div className={styles.searchCostForm}>
                    <div className={styles.searchCostFormLabel}>
                        <div className={styles.searchCostFormLabelTitle}>
                            계산 결과
                        </div>
                        <div className={styles.searchCostFormLabelDescription}>
                            픽업지에서 배송지까지의 요금은 다음과 같습니다.
                        </div>
                    </div>

                    <Table>
                        <thead>
                        <tr>
                            <th>픽업지</th>
                            <th>배송지</th>
                            <th>배송 요금</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.prices && this.state.prices.default > 0 && (
                                <tr>
                                    <td>{this.state.selected_departure_location}</td>
                                    <td>{this.state.selected_arrival_location}</td>
                                    <td style={{maxWidth: '200px'}}>
                                        {
                                            this.state.prices &&
                                            <div>{this.state.prices.default.toLocaleString()} 원</div>
                                        }
                                        <span className={styles.searchCostDescription}>
                                            ※ 픽업지, 도착지가 지하철역으로부터 700m 바깥에 있을 경우 각각 배송 가격이 1,000원씩 상승됩니다.
                                        </span>
                                    </td>
                                </tr>
                            )
                        }
                        </tbody>
                    </Table>
                </div>
                
                <div className={styles.searchCostForm}>
                    <div className={styles.searchCostFormLabel}>
                        <div className={styles.searchCostFormLabelTitle}>
                            상세 배송 요금 조회
                        </div>
                        
                    </div>
                    <Form.Group className={styles.orderFormSectionRow}>
                        <Form.Label className={styles.orderFormSectionRowName}>픽업지</Form.Label>
                        <div className={styles.orderFormSectionRowInput}>
                            <Form.Control
                                id="sender_address"
                                type="text"
                                placeholder="주소 (클릭하여 검색)"
                                value={this.state.sender_address}
                                onChange={event => this.on_change(event)}
                                onClick={() => this.setState(prevState => ({sender_address_finder: !prevState.sender_address_finder}))}
                                readOnly required/>
                            {
                                this.state.sender_address_finder &&
                                <PostCodeForm on_complete={this.on_complete_search('sender_address')}/>
                            }
                            {this.state.prices.distance_subway_sender >= 2000 && (
                                <Form.Text className="text-danger">
                                    입력하신 물품 픽업지가 지하철역으로부터 너무 멀어 접수가 어렵습니다!
                                </Form.Text>
                            )}
                            <Form.Text className="text-muted">
                                주소 검색을 통해 시, 구가 포함된 정확한 주소를 입력해주세요. 입력된 주소로 택배원이 물품을 가지러 갑니다.
                            </Form.Text>
                            <Form.Text className="text-muted">
                                버스 또는 도보 이동 경로가 지나치게 긴 경우 원칙적으로 주문 접수가 취소될 수 있습니다.
                            </Form.Text>
                        </div>
                    </Form.Group>

                    <Form.Group className={styles.orderFormSectionRow}>
                        <Form.Label className={styles.orderFormSectionRowName}>배송지</Form.Label>
                        <div className={styles.orderFormSectionRowInput}>
                            <Form.Control
                                id="receiver_address"
                                type="text"
                                placeholder="주소 (클릭하여 검색)"
                                value={this.state.receiver_address}
                                onChange={event => this.on_change(event)}
                                onClick={() => this.setState(prevState => ({receiver_address_finder: !prevState.receiver_address_finder}))}
                                readOnly required/>
                            {
                                this.state.receiver_address_finder &&
                                <PostCodeForm on_complete={this.on_complete_search('receiver_address')}/>
                            }
                            
                            {this.state.prices.distance_subway_receiver >= 2000 && (
                                <Form.Text className="text-danger">
                                    입력하신 배송지가 지하철역으로부터 너무 멀어 접수가 어렵습니다!
                                </Form.Text>
                            )}
                            <Form.Text className="text-muted">
                                주소 검색을 통해 시, 구가 포함된 정확한 주소를 입력해주세요. 입력된 주소로 택배원이 물품을 전달합니다.
                            </Form.Text>
                            <Form.Text className="text-muted">
                                버스 또는 도보 이동 경로가 지나치게 긴 경우 원칙적으로 주문 접수가 취소될 수 있습니다.
                            </Form.Text>
                        </div>
                    </Form.Group>
                    

                    <Form.Group className={styles.orderFormSectionRow}>
                        <Form.Label className={styles.orderFormSectionRowName}>
                            결제 금액
                        </Form.Label>
                        <Form.Label>
                            <div className={[styles.orderFormSectionRowInput, styles.priceRow].join(' ')}>
                                <p className={this.state.prices.discount ? styles.prevPrice : ''}>
                                    {(this.state.prices.default + this.state.prices.addition).toLocaleString()} 원
                                </p>
                                {this.state.prices.discount ? (
                                    <p>{(this.state.prices.total).toLocaleString()} 원</p>
                                ) : ''}
                            </div>
                            {this.state.prices.addition? (
                                    <Form.Text className="text-muted">
                                        {this.state.prices.addition_sender && this.state.prices.addition_receiver
                                            ? '※ 픽업지와 도착지가 모두'
                                            : this.state.prices.addition_sender
                                                ? '※ 픽업지가'
                                                : this.state.prices.addition_receiver
                                                    ? '※ 도착지가'
                                                    : ''}
                                        {` 지하철역으로부터 700m 바깥에 있어서 배송 가격이 ${this.state.prices.addition.toLocaleString()}원 상승했습니다`}
                                    </Form.Text>
                            ) : null}
                        </Form.Label>
                    </Form.Group>
                </div>
            </div>
        )
    }
}


export default SearchCostForm
