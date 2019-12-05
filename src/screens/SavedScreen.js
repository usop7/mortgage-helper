import React from 'react';

import { Text, View, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { getAllData, countData } from '../storage/StorageHelper'

import { inputNumberFormat, uncomma, comma } from '../tools/comma'

const WIDTH = Dimensions.get('window').width;

class SavedScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listings: [],
        }
        this._setListings();
    }

    render() {
        return (
        <View style={styles.container}>
            <FlatList
                data={this.state.listings}
                keyExtractor= { (item, index) => index.toString() }
                renderItem={this._renderItem}
            />
          </View>
        );
    }

    async _setListings() {
        let listings = await getAllData();
        await this.setState({listings: listings}, () => {
            console.log(this.state.listings);
            console.log(this.props);
        });
    }

    _renderItem = ({item}) => (
        <ListingComponent
            title={item[0]}
            item={JSON.parse(item[1])} />
    );
}

class ListingComponent extends React.PureComponent {
    render() {
        return (
            <View style={[styles.box, styles.dropShadowDefault]}>
                <Text style={styles.title}>{this.props.title}</Text>

                <View style={styles.row}>
                    <Text style={styles.cell}>Home Price</Text>
                    <Text style={styles.cell}>$ {comma(this.props.item.homePrice)}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.cell}>Down Payment</Text>
                    <Text style={styles.cell}>$ {comma(this.props.item.downPayment)}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.cell}>Interest Rate</Text>
                    <Text style={styles.cell}>{this.props.item.rate} %</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.cell}>Mortgage term</Text>
                    <Text style={styles.cell}>{this.props.item.term} years</Text>
                </View>

                <Text style={styles.line}>Created: {this.props.item.created}</Text>

                <View style={styles.row}>
                    <Text style={[styles.cell, {color: '#0959b0'}]}>{this.props.item.frequency} payment</Text>
                    <Text style={[styles.cell, {color: '#0959b0'}]}>$ {this.props.item.result}</Text>
                </View>

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
    title: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    box: {
        marginTop: 10,
        marginBottom: 10,
        width: '100%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 5,
        paddingLeft: 20,
        backgroundColor: 'white',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: (WIDTH * 0.9) / 2,
    },
    /* Drop Shadows */
    dropShadowDefault: {
        //ios
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: {height: 2, width: 0},
        //android 
        elevation: 2,
    }

});

const mapStateToProps = (state) => {
    const { listings } = state
    return { listings }
};
  
export default connect(mapStateToProps)(SavedScreen);