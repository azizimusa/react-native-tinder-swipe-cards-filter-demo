
import React, {Component} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import { Container, Content, Header, Text, Left, Body, Right, Title, Form, Item, Picker } from 'native-base';
import SwipeCards from 'react-native-swipe-cards';
import {Icon} from "react-native-vector-icons";
const Realm = require('realm');
let realm;
let tempData;

export default class App extends React.Component {

  constructor(props) {
    super(props);
    console.disableYellowBox = true;

    let cards = [
            {name: 'Yana', backgroundColor: 'red', age: 19},
            {name: 'Siti', backgroundColor: 'purple', age: 20},
            {name: 'Minah', backgroundColor: 'green', age: 30},
            {name: 'Fatimah', backgroundColor: 'blue', age: 25},
            {name: 'Jeny...', backgroundColor: 'cyan', age: 35},
            {name: 'Salmonela', backgroundColor: 'orange', age: 40},
            {name: 'Mak Limah', backgroundColor: 'orange', age: 31}
            ];

    this.state = {
      cards: cards,
      realm: null,
      selected2: 'key00'
    };

      const mydata = {
          name: 'mydata',
          primaryKey: 'id',
          properties: {
              id: {type: 'int'},
              name: {type: 'string'},
              backgroundColor: {type: 'string'},
              age: {type: 'int', default: 0}
          }
      }

      Realm.open({
          schema: [mydata],
          schemaVersion: 1,
          migration: (oldRealm, newRealm) => {
          }
      }).then(realm => {
          close();
      });

    realm = new Realm();

    if (realm.objects('mydata').length === 0) {
      realm.write(() => {

        for (let i = 0; i < cards.length; i++) {

          realm.create('mydata', {
            id: i + 1,
            name: cards[i].name,
            backgroundColor: cards[i].backgroundColor,
            age: cards[i].age
          })

        }

      })

    }


  }

  applyFilter() {
    this.setState({cards: tempData})
  }

  onValueChange2(value) {

    this.setState({
      selected2: value
    })

    let userData = realm.objects('mydata');
    let filterUser;

    switch (value) {

      case 'key0':
        filterUser = userData.filtered('age < 20');
        console.log("pilih bawah 20");
        break;
      case 'key1':
        filterUser = userData.filtered('age < 30');
        console.log("pilih bawah 30");
        break;
      case 'key2':
        filterUser = userData.filtered('age >= 20 AND age <= 30');
        console.log("pilih 20 ke 30");
        break;
      case 'key3':
        filterUser = userData.filtered('age > 30');
        console.log("pilih atas 30");
        break;

    }

    tempData = [];

    for (let i = 0; i < filterUser.length; i++) {
      tempData.push(filterUser[i]);
    }

    console.log(tempData);
    this.applyFilter();

  }

  handleYup (card) {
    console.log(`Yup for ${card.name}`)
  }
  handleNope (card) {
    console.log(`Nope for ${card.name}`)
  }
  handleMaybe (card) {
    console.log(`Maybe for ${card.name}`)
  }

  render() {
        return (
            <Container>
              <Header>
                <Left/>
                <Body>
                <Title>Sort Array</Title>
                </Body>
                <Right />
              </Header>
              <Body>
              <Content>

                <Form>
                  <Item picker>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined }}
                        placeholder="Age Range"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.selected2}
                        onValueChange={this.onValueChange2.bind(this)}
                    >
                      <Picker.Item label="Semua" value="key00" />
                      <Picker.Item label="Bawah 20" value="key0" />
                      <Picker.Item label="Bawah 30" value="key1" />
                      <Picker.Item label="20 - 30" value="key2" />
                      <Picker.Item label="Atas 30" value="key3" />
                    </Picker>
                  </Item>
                </Form>

                <SwipeCards
                    cards={this.state.cards}
                    renderCard={(cardData) => <Card {...cardData} />}
                    renderNoMoreCards={() => <NoMoreCards />}
                    handleYup={this.handleYup}
                    handleNope={this.handleNope}
                    handleMaybe={this.handleMaybe}
                    hasMaybeAction
                />

              </Content>

              </Body>
            </Container>
        );
    }
}

//CARD COMPONENT
class Card extends React.Component {
  constructor(props) {
    super(props);

    console.log(this.props.name);

  }

  render() {
    return (
        <View style={[styles.card, {backgroundColor: this.props.backgroundColor}]}>
            <Text style={{fontSize: 40}}>Nama: {this.props.name}</Text>
            <Text style={{fontSize: 38}}>Umur: {this.props.age}</Text>
        </View>
    )
  }
}

class NoMoreCards extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <View>
          <Text style={styles.noMoreCardsText}>No more cards</Text>
        </View>
    )
  }
}
//CARD COMPONENT

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 300,
  },
  noMoreCardsText: {
    fontSize: 22,
  }
})
