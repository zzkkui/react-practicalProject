import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { 
  HeaderWrapper, 
  Logo,
  Nav,
  NavItem,
  NavSearch,
  Addition,
  Button,
  SearchWrapper,
  SearchInfo,
  SearchInfoTitle,
  SearchInfoSwitch,
  SearchInfoItem,
  SearchInfoList
} from './style';
import { actionCreator } from './store';
import { actionCreators as loginActionCreators } from '../../pages/logIn/store'

class Header extends Component {

  render() {
    const {focused, list, login, logout, searchInputFocused, searchInputBlur} = this.props
    return (
      <Fragment>
        <HeaderWrapper>
          <Link to='/'>
            <Logo></Logo>
          </Link>     
          <Nav>
            <NavItem className='left active'>首页</NavItem>
            <NavItem className='left'>下载APP</NavItem>
            {
              login ? 
                <NavItem onClick={logout} className='right'>退出</NavItem> : 
                <Link to='/login'><NavItem className='right'>登陆</NavItem></Link>
            }         
            <NavItem className='right'>
              <i className='iconfont'>&#xe636;</i>
            </NavItem>
            <SearchWrapper>
              <CSSTransition 
                in={focused}
                timeout={300}
                classNames='slide'>
                <NavSearch 
                  className={focused ? 'focused' : ' '}
                  onFocus={() => {searchInputFocused(list)}}
                  onBlur={searchInputBlur}
                ></NavSearch>
              </CSSTransition> 
              <CSSTransition 
                in={focused}
                timeout={300}
                classNames='fade'>         
                <i className={focused ? 'focused iconfont' : 'iconfont'}>&#xe60c;</i>
              </CSSTransition>
              {this.getListArea()}
            </SearchWrapper>        
          </Nav>
          <Addition>
            <Link to='/write'>
              <Button className='writting'>
                <i className="iconfont">&#xe615;</i>
                写文章
              </Button>
            </Link>
            <Button className='reg'>注册</Button>        
          </Addition>
        </HeaderWrapper>
      </Fragment>
    )
  }

  getListArea() {
    const {focused, list, page, mouseIn, totalPage, handleMouseEnter, handleMouseLeave, handleChangePage} = this.props
    const newList = list.toJS();
    let pageList = []
    // console.log(newList)
    if(newList.length) {
      for(let i = (page - 1) * 10; i < page * 10; i++) {
        if(!newList[i]) {
          break
        }
        pageList.push(
          <SearchInfoItem key={newList[i]}>{newList[i]}</SearchInfoItem>
        )
      }
    }    

    if(focused || mouseIn) {
      return ( 
        <SearchInfo 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>
          <SearchInfoTitle>
            热门搜索
            <SearchInfoSwitch 
              onClick={() => {handleChangePage(page, totalPage, this.spinIcon)}}>
              <i ref={(icon) => {this.spinIcon = icon}} className='iconfont spin'>&#xe851;</i>
              换一批
            </SearchInfoSwitch>
            <SearchInfoList>
              {pageList}
            </SearchInfoList>             
          </SearchInfoTitle>
        </SearchInfo>
      )
    }else {
      return null
    }
  }

}


const mapStateToProps = (state, ownProps) => {
  return {
    // focused: state.get('header').get('focused')
    focused: state.getIn(['header', 'focused']),
    list: state.getIn(['header', 'list']),
    page: state.getIn(['header', 'page']),
    mouseIn: state.getIn(['header', 'mouseIn']),
    totalPage: state.getIn(['header', 'totalPage']),
    login: state.getIn(['logIn', 'login'])
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    searchInputFocused: (list) => {
      if(list.size === 0) {
        dispatch(actionCreator.getList())
      }      
      dispatch(actionCreator.searchInputFocused())
    },
    searchInputBlur: () => {
      dispatch(actionCreator.searchInputBlur())
    },
    handleMouseEnter: () => {
      dispatch(actionCreator.handleMouseEnter())
    },
    handleMouseLeave: () => {
      dispatch(actionCreator.handleMouseLeave())
    },
    handleChangePage: (page, totalPage, spin) => {
      let originAngle = spin.style.transform.replace(/[^0-9]/ig, '')
      if(originAngle) {
        originAngle = parseInt(originAngle, 10)
      }else {
        originAngle = 0
      }
      originAngle += 360
      spin.style.transform = `rotate(${originAngle}deg)`
      let nextPage
      if(page === totalPage) {
        nextPage = 1
      }else{
        nextPage = ++page
      }
      dispatch(actionCreator.changePage(nextPage))
    },
    logout() {
			dispatch(loginActionCreators.logout())
		}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)