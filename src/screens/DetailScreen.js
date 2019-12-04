import React from 'react';
import { Text, View, StyleSheet, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

import { inputNumberFormat, uncomma, comma } from '../tools/comma'


const WIDTH = Dimensions.get('window').width;

class DetailScreen extends React.Component {

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Payment Schedule</Text>
                <View style={styles.row}>
                    <Text style={[styles.cell, {width: 30}]}>#</Text>
                    <Text style={styles.cell}>Principal</Text>
                    <Text style={styles.cell}>Interest</Text>
                    <Text style={styles.cell}>Balance</Text>
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
                <Text style={styles.cell}>{this.props.balance}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        borderColor: 'gray',
    },
    cell: {
        width: (WIDTH * 0.9 - 30)/3,
        textAlign: 'center'
    }
});

const mapStateToProps = (state) => {
    const { values } = state
    return { values }
};
  
export default connect(mapStateToProps)(DetailScreen);