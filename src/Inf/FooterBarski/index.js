import React, {Component} from 'react';
import {Grid, Row, Col, Image} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

import githubLogo from './github-logo.png';
import githubLogoShadow from './github-logo-shadow.png';
import { jeffskiRoutes } from '../../app';
import './styles.css';

class FooterBarski extends Component {

  constructor(props){
    super(props);

    this.githubImgMouseOver = this.githubImgMouseOver.bind(this);
    this.gitihubImgMouseOut = this.gitihubImgMouseOut.bind(this);

    this.state = {
      isGithubMouseOver : false
    }
  }

  //on hover effect for the github logo link
  githubImgMouseOver(){
    this.setState({
      isGithubMouseOver: true
    });
  }

  //on hover effect for the github logo link
  gitihubImgMouseOut(){
    this.setState({
      isGithubMouseOver: false
    });
  }

  render(){
    let githubLogoImage = this.state.isGithubMouseOver ? githubLogoShadow : githubLogo;

    return(
      <Grid className="FooterBarski">
        <Row className="show-grid">
          <Col xs={2} sm={1} />
          <Col xs={7} sm={10} className="footerBarskiLinkWrapper">
            <div className="footerLinksArea" >
              <LinkContainer to="/careers">
                <a
                  href= "/careers"
                  className="footerBarskiLink"
                >
                  Careers?
                </a>
              </LinkContainer>
              <div className="footLinkDivider" >
                &nbsp;&bull;&nbsp;
              </div>
              <LinkContainer to={jeffskiRoutes.login}>
                <a
                  href={jeffskiRoutes.login}
                  className="footerBarskiLink"
                >
                  Account
                </a>
              </LinkContainer>
            </div>
          </Col>
          <Col xs={3} sm={1} >
            <a title="My Open Source Website!"
              href="https://github.com/jeffski13/jeffDotSki/tree/master/client"
            >
              <Image src={githubLogoImage}
                className="githubLogo"
                onMouseOver={this.githubImgMouseOver}
                onMouseOut={this.gitihubImgMouseOut}
              />
            </a>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default FooterBarski;