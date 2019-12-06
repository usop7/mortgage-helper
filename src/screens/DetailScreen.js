import React from 'react';
import { Text, View, StyleSheet, FlatList, Dimensions, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

import { uncomma, comma } from '../tools/comma'


const WIDTH = Dimensions.get('window').width;

class DetailScreen extends React.Component {

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.box}>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultCell}>Mortgage Amount</Text>
                        <Text style={styles.resultCell}>$ {this.props.values.mortgageAmount}</Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultCell}>Total Interest</Text>
                        <Text style={styles.resultCell}>$ {this.props.values.totalInterest}</Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultCell}>Total Payment</Text>
                        <Text style={styles.resultCell}>$ {this.props.values.totalPayment}</Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text style={[styles.resultCell, {fontWeight: 'bold'}]}>{this.props.values.frequency} payment</Text>
                        <Text style={[styles.resultCell, {fontWeight: 'bold'}]}>$ {this.props.values.result}</Text>
                    </View>

                </View>

                <Text style={styles.header}>Payment Schedule</Text>
                <View style={styles.tableHeader}>
                    <Text style={[styles.cell, {width: 30, color: 'white'}]}>#</Text>
                    <Text style={[styles.cell, {color: 'white'}]}>Principal</Text>
                    <Text style={[styles.cell, {color: 'white'}]}>Interest</Text>
                    <Text style={[styles.cell, {color: 'white'}]}>Balance</Text>
                </View>

                <FlatList
                    data={this.props.values.details}
                    keyExtractor= { (item, index) => index.toString() }
                    renderItem={this._renderItem}
                />
          </View>
        );
    }
    _renderItem = ({item}) => (
        <RowComponent 
            no={item.No}
            principal={item.Principal}
            interest={item.Interest}
            balance={item.Balance} />
    );
    

}

class RowComponent extends React.PureComponent {
    render() {
        return (
            <View style={styles.row}>
                <Text style={[styles.cell, {width: 30}]}>{this.props.no}</Text>
                <Text style={styles.cell}>{this.props.principal}</Text>
                <Text style={styles.cell}>{this.props.interest}</Text>
                <Text style={[styles.cell, {fontWeight: 'bold'}]}>{this.props.balance}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        width: '100%',
        alignSelf: 'stretch',
        padding: 20
    },
    header: {
        fontSize: 18,
        color: '#3e68ab',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        paddingBottom: 5,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#e3e3e3',
    },
    tableHeader: {
        flexDirection: 'row',
        paddingBottom: 5,
        paddingTop: 5,
        backgroundColor: '#3e68ab',
        color: 'white',
    },
    cell: {
        width: (WIDTH * 0.9 - 30)/3,
        textAlign: 'center'
    },
    box: {
        marginTop: 10,
        width: '100%',
        alignSelf: 'center',
        backgroundColor: '#f0b026',
        padding: 5,
        paddingLeft: 20,
        marginBottom: 20,
        borderRadius: 10,
    },
    resultRow: {
        flexDirection: 'row',
    },
    resultCell: {
        width: (WIDTH * 0.9) / 2,
    },
});

const mapStateToProps = (state) => {
    const { values } = state
    return { values }
};
  
export default connect(mapStateToProps)(DetailScreen);