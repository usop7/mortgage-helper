import React from 'react';
import { ScrollView, Text, View, StyleSheet, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { PieChart } from 'react-native-svg-charts'
import { Text as SvgText } from 'react-native-svg'

import { uncomma, comma } from '../tools/comma'
import { Color } from '../components/Values'

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

class ChartScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mortgageAmount: '',
            result: '',
            frequency: 'Monthly',
            n: 0, 
            term: 0,
        }
    }

    componentDidMount() {
        // add listner
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
            this.setState({
                mortgageAmount: this.props.values.mortgageAmount,
                result: this.props.values.result,
                n: this.props.values.n,
                term: this.props.values.term,
                frequency: this.props.values.frequency,
            });
        });
    }

    render() {
        return (
            <ScrollView style={styles.screen}>

                <View style={styles.header}>
                    <Text style={{fontSize: 18, color: 'white', fontFamily: 'Lato-Regular'}}>Mortgage Analysis</Text>
                </View>

                <View style={styles.container}>
                    {this.renderSummary()}
                    {this.renderTotalChart()}
                    {this.renderTable()}

                </View>



          </ScrollView>
        );
    }

    renderSummary() {
        const totalPayment = comma(parseInt(uncomma(this.state.result) * this.state.n));

        return (
            <View style={{margin: 15}}>
                <Text style={styles.summary}>
                    <Text>Your mortgage amount is </Text>
                    <Text style={{fontFamily: 'Lato-Bold'}}>${this.state.mortgageAmount}</Text>
                    <Text> and the {this.state.frequency.toLowerCase()} payment will be </Text>
                    <Text style={{fontFamily: 'Lato-Bold'}}>${this.state.result} for {this.state.term} years.</Text>
                    <Text>{"\n\n"}Your total payment is calculated as  </Text>
                    <Text style={{fontFamily: 'Lato-Bold'}}>${totalPayment}</Text>
                    <Text> ($ {this.state.result} x {this.state.n} payments) which consists of principal and interest.</Text>
                </Text>
            </View>

        )

    }

    renderTotalChart() {
        if (this.state.result != 0 && this.state.result !== '') {
            const totalPayment = parseInt(uncomma(this.state.result) * this.state.n);
            const mortgageAmount = parseInt(uncomma(this.state.mortgageAmount));
            const totalInterest = totalPayment - mortgageAmount;
            const mortgageRate = Math.round(mortgageAmount / totalPayment * 100);
            const data = [mortgageRate, 100 - mortgageRate];
            const colors = [Color.light, Color.yellow];

            const Labels = ({ slices, height, width }) => {
                return slices.map((slice, index) => {
                    const { pieCentroid, data } = slice;
                    return (
                        <SvgText
                            key={index}
                            x={pieCentroid[ 0 ]}
                            y={pieCentroid[ 1 ]}
                            fill={Color.dark}
                            textAnchor={'middle'}
                            alignmentBaseline={'middle'}
                            fontSize={18}
                            strokeWidth={0.2}
                        >
                            {data.value}%
                        </SvgText>
                    )
                })
            }
    
            const pieData = data
                .filter(value => value > 0)
                .map((value, index) => ({
                    value,
                    svg: {
                        fill: colors[index]
                    },
                    key: index,
                }))
    
            return (
                <View style={{marginTop: 15}}>
                    <PieChart
                        style={ { height: 200 } }
                        spacing={0}
                        innerRadius={'40%'}
                        data={ pieData }>
                        <Labels/>
                    </PieChart>
                    
                    <View style={[styles.row, {marginTop: 15, alignSelf: 'center'}]}>
                        <Icon name="square" size={20} color={Color.yellow} style={{marginLeft: 10}} />
                        <Text style={styles.label}>Interest</Text>

                        <Icon name="square" size={20} color={Color.light} style={{marginLeft: 10}} />
                        <Text style={styles.label}>Principal</Text>
                    </View>
                </View>
            )
        } else {
            return (
                <View></View>
            )
        }
    }

    renderTable() {
        let totalPayment = 0;
        if (this.state.result != 0 && this.state.result !== '') {
            totalPayment = parseInt(uncomma(this.state.result) * this.state.n);
        }
        const mortgageAmount = this.state.mortgageAmount != "" ? parseInt(uncomma(this.state.mortgageAmount)) : 0;
        const totalInterest = (totalPayment > 0) ? totalPayment - mortgageAmount : 0;
        const mortgageRate = (totalPayment > 0) ? Math.round(mortgageAmount / totalPayment * 100) : 0;
        const interestRate = (totalPayment > 0) ? 100 - mortgageRate : 0;
        const totalRate = (totalPayment > 0) ? 100 : 0;

        return (
            <View style={{marginTop: 15}}>
                <View style={[styles.rowLine, {backgroundColor: '#e3e3e3'}]}>
                    <Text style={styles.cell}></Text>
                    <Text style={styles.cell}>Amount</Text>
                    <Text style={styles.cell}>Proportion</Text>
                </View>

                <View style={styles.rowLine}>
                    <Text style={styles.cell}>Principal</Text>
                    <Text style={styles.cell}>$ {comma(mortgageAmount)}</Text>
                    <Text style={styles.cell}>{mortgageRate}%</Text>
                </View>

                <View style={styles.rowLine}>
                    <Text style={styles.cell}>Interest</Text>
                    <Text style={styles.cell}>$ {comma(totalInterest)}</Text>
                    <Text style={styles.cell}>{interestRate}%</Text>
                </View>

                <View style={styles.rowLine}>
                    <Text style={styles.cell}>Total</Text>
                    <Text style={styles.cell}>$ {comma(totalPayment)}</Text>
                    <Text style={styles.cell}>{totalRate}%</Text>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Color.primary,
    },
    header: {
        width: '100%',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 10,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        width: '95%',
        alignSelf: 'center',
        padding: 5,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        minHeight: HEIGHT - 120,
    },
    summary: {
        fontFamily: 'Lato-Regular',
    },
    headerItem: {
        width: WIDTH * 0.95 / 2,
        alignItems: 'center',
        color: Color.dark,
        fontFamily: 'Lato-Regular',
    },
    row: {
        margin: 3,
        flexDirection: 'row',
    },
    rowLine: {
        margin: 3,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#e3e3e3',
    },
    cell: {
        fontFamily: 'Lato-Regular',
        padding: 3,
        textAlign: 'center',
        width: WIDTH * 0.85 / 3,
    },
    label: {
        color: Color.dark,
        marginLeft: 10,
        marginRight: 15,
    }
});

const mapStateToProps = (state) => {
    const { values } = state
    return { values }
};
  
export default connect(mapStateToProps)(ChartScreen);