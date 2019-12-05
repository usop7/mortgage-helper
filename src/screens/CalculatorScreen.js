import React from 'react';
import { Text, View, StyleSheet, TextInput, Picker } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { calculateValues } from '../actions/CalculateAction';
import Icon from 'react-native-vector-icons/FontAwesome';

import { inputNumberFormat, uncomma, comma } from '../tools/comma'

class CalculatorScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            homePrice: '',
            downPayment: '',
            rate: 0,
            term: 0,
            frequency: 'monthly',
            
            result: '',
            mortgageAmount: '',
            totalInterest: '',
            totalPayment: '',
            details: [],
        }
    }

    render() {
      return (
        <View style={styles.container}>
            <Text style={styles.header}>Mortgage Detail</Text>

            <View style={styles.row}>
                <Icon name="home" size={35} color="gray" />
                <TextInput 
                    style={styles.input}
                    onChangeText={text => {this._onInputChange(text, 'homePrice')}}
                    value={this.state.homePrice}
                    placeholder="Home Price"/>
            </View>

            <View style={styles.row}>
                <Icon name="download" size={35} color="gray" />
                <TextInput 
                    style={styles.input} 
                    onChangeText={text => {this._onInputChange(text, 'downPayment')}}
                    value={this.state.downPayment}
                    placeholder="Down Payment"/>
            </View>

            <View style={styles.row}>
                <Icon name="calendar" size={35} color="gray" />
                <TextInput 
                    style={styles.input}
                    onChangeText={text => {this._onInputChange(text, 'term')}}
                    placeholder="Mortgage Years"/>
            </View>

            <View style={styles.row}>
                <Icon name="percent" size={35} color="gray" />
                <TextInput 
                    style={styles.input}
                    onChangeText={text => {this._onInputChange(text, 'rate')}}
                    placeholder="Interest Rate"/>
            </View>

            <View style={styles.row}>
                <Icon name="clock-o" size={35} color="gray" />
                <Picker
                    selectedValue={this.state.frequency}
                    style={styles.picker}
                    onValueChange={(value, index) => {this._onInputChange(value, 'frequency')}} >
                    <Picker.Item label="Monthly" value="monthly" />
                    <Picker.Item label="Bi-weekly" value="bi-weekly" />
                    <Picker.Item label="Weekly" value="weekly" />
                </Picker>
            </View>

            <View style={styles.box}>
                <Text style={styles.header}>Your {this.state.frequency} payment will be</Text>
                <Text style={styles.result}>$ {comma(this.state.result)}</Text>
            </View>

        </View>
      );
    }

    _onInputChange = (text, type) => {
        this.setState({
            [type]: text
        },() => {
            this._calculateMortgage();
        });
    }

    _calculateMortgage = () => {

        // Variable Declaration
        const home = uncomma(this.state.homePrice);
        const down = uncomma(this.state.downPayment);
        const rate = this.state.rate;
        const year = this.state.term;
        const frequency = this.state.frequency;
        let isValid = (home > 0 && rate >= 0 && year > 0);


        var detailArray = [];
        const mortgage = +home - down;
        let result = '', totalPayment = '', totalInterest = '';
        if (isValid) {
        
            // Calculation
            let balance = mortgage;
            
            let divider = 1;
            if (frequency === "monthly")
                divider = 12;
            else if (frequency === "bi-weekly")
                divider = 26;
            else if (frequency === "weekly")
                divider = 52;

            const i = rate/divider/100;
            const v = 1/(1+i);
            const n = Math.trunc(year * divider);
            const formula = (1 - Math.pow(v, n)) / i;

            if (i === 0)
                result = mortgage / n;
            else
                result = mortgage / formula;

            totalPayment = result * n;
            totalInterest = totalPayment - mortgage;

            // Calculate details
            for (let t = 1; t <= n; t++)
            {
                let interest = balance * i;
                let principal = result - interest;
                balance = balance - principal;

                detailArray = detailArray.concat({
                                            No: t, 
                                            Principal: comma(Math.round(principal, 0)), 
                                            Interest: comma(Math.round(interest, 0)), 
                                            Balance: comma(Math.round(balance, 0))});
            }

        }

        // Update Results
        this.setState({
            result: comma(Math.round(result, 0)),
            mortgageAmount: comma(mortgage),
            totalInterest: comma(Math.round(totalInterest, 0)),
            totalPayment: comma(Math.round(totalPayment, 0)),
            details: detailArray
        }, () => {
            this.props.calculateValues(this.state);
        } );
    }

  }

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignSelf: 'stretch',
        padding: 30
    },
    header: {
        fontSize: 18,
        color: '#0959b0',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#d7dade',
        borderRadius: 30,
        width: '85%',
        height: 40,
        marginLeft: 20,
        paddingLeft: 20,
    },
    picker: {
        height: 40, 
        width: '85%',
        marginLeft: 10,
    },
    box: {
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#0959b0',
        padding: 5,
    },
    result: {
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'center',
    }
});

const mapStateToProps = (state) => {
    const { values } = state
    return { values }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        calculateValues,
    }, dispatch)
  );

export default connect(mapStateToProps, mapDispatchToProps)(CalculatorScreen);