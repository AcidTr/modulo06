import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: 1,
    loadingFooter: false,
    refreshing: false,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    this.setState({ loading: true });
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({ stars: response.data, loading: false });
  }

  handleNextPage = async () => {
    const { navigation } = this.props;
    this.setState({ loadingFooter: true });
    const { stars } = this.state;
    let { page } = this.state;
    const user = navigation.getParam('user');
    page += 1;
    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    this.setState({
      stars: [...stars, ...response.data],
      loadingFooter: false,
      page,
    });
  };

  handleRefresh = async () => {
    const { navigation } = this.props;
    this.setState({ refreshing: true });
    const user = navigation.getParam('user');
    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({
      stars: response.data,
      refreshing: false,
      page: 1,
    });
  };

  handleRepoWebView = repository => {
    const { navigation } = this.props;
    navigation.navigate('Repository', { repository });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, loadingFooter, refreshing } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Stars
            data={stars}
            keyExtractor={star => String(star.id)}
            onEndReached={this.handleNextPage}
            onEndReachedThreshold={0.2}
            onRefresh={this.handleRefresh}
            refreshing={refreshing}
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleRepoWebView(item)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
        {loadingFooter ? <ActivityIndicator /> : <></>}
      </Container>
    );
  }
}
