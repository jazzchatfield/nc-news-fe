import React from "react";
import * as api from "../api";
import ArticleCard from "./ArticleCard";
import ArticleSorter from "./ArticleSorter";

import formatDates from "../utils/formatDates";
import ErrorDisplayer from "./ErrorDisplayer";
import PageChooser from "./PageChooser";

class Articles extends React.Component {
  state = {
    articleCount: 0,
    articles: [],
    isLoading: true,
    error: null,
    sort_by: null,
    order: null,
    page: 0
  };

  updatePage = page => {
    this.setState({ page });
  };

  useArticleSorter = event => {
    event.preventDefault();
    let sort_by = "";
    let order = "";
    if (event.target[0].value === "Date") {
      sort_by = "created_at";
    } else if (event.target[0].value === "Comments") {
      sort_by = "comment_count";
    } else sort_by = "votes";
    if (event.target[1].value === "Highest / Most recent") {
      order = "desc";
    } else order = "asc";
    this.setSortBy(sort_by, order);
  };

  setSortBy = (sort_by, order) => {
    this.setState({ sort_by, order });
  };

  render() {
    const { isLoading, articles, articleCount, error } = this.state;

    if (isLoading) return <p className="loading">Loading...</p>;
    if (error) return <ErrorDisplayer error={error} />;

    return (
      <main>
        <h2>All articles</h2>
        <p>
          Number of articles: <strong>{articleCount}</strong>
        </p>
        <ArticleSorter useArticleSorter={this.useArticleSorter} />
        <PageChooser
          count={this.state.articleCount}
          page={this.state.page}
          updatePage={this.updatePage}
        />
        <ul>
          {articles.map(article => {
            return <ArticleCard key={article.article_id} article={article} />;
          })}
        </ul>
        <PageChooser
          count={this.state.articleCount}
          page={this.state.page}
          updatePage={this.updatePage}
        />
      </main>
    );
  }

  componentDidMount = () => {
    api
      .getArticles()
      .then(([articles, articleCount]) => {
        this.setState({
          articles: formatDates(articles),
          isLoading: false,
          articleCount
        });
      })
      .catch(error => {
        this.setState({ error: error.response, isLoading: false });
      });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevState.sort_by !== this.state.sort_by ||
      prevState.order !== this.state.order ||
      prevState.page !== this.state.page
    ) {
      api
        .getArticles(this.state.sort_by, this.state.order, this.state.page)
        .then(([articles, articleCount]) => {
          this.setState({
            articles: formatDates(articles),
            articleCount
          });
        })
        .catch(error => {
          this.setState({ error: error.response });
        });
    }
  };
}

export default Articles;
