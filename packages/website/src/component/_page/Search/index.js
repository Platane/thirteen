import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Search as SimpleSearch } from './Search'
import {
  selectSearchResult,
  selectSearchParam,
} from '../../../store/selector/search'
import { goTo } from '../../../store/action/router'

import type { State } from '../../../store/type'

const trimFalsyValue = o => {
  const copy = {}
  Object.keys(o)
    .filter(key => o[key])
    .forEach(key => {
      copy[key] = o[key]
    })
  return copy
}

const setSearchParam = searchParam =>
  goTo('/search', trimFalsyValue(searchParam))

const withSetter = C =>
  class extends React.Component {
    setQuery = query =>
      this.props.setSearchParam({ ...this.props.searchParam, query })

    render() {
      return <C {...this.props} setQuery={this.setQuery} />
    }
  }

export const Search = compose(
  connect(
    (state: State) => ({
      entries: selectSearchResult(state),
      searchParam: selectSearchParam(state),
    }),
    { setSearchParam }
  ),

  withSetter
)(SimpleSearch)
