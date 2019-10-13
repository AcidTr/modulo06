import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { RepoWebView } from './styles';

export default class Repository extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repository').name,
  });

  state = {
    repository: '',
  };

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  componentDidMount() {
    const { navigation } = this.props;
    const repository = navigation.getParam('repository');
    this.setState({ repository });
  }

  render() {
    const { repository } = this.state;
    return (
      <RepoWebView
        source={{ uri: repository.html_url }}
        style={{ marginTop: 20 }}
      />
    );
  }
}
