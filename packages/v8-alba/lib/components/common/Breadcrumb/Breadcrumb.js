// import React from 'react';
import {Link} from 'react-router';
import {Breadcrumb, BreadcrumbItem} from 'reactstrap';
// import routes from '../../routes';
//
// const findRouteName = url => routes[url];
//
const getPaths = (pathname) => {
  const paths = ['/'];

  if (pathname === '/') return paths;

  pathname.split('/').reduce((prev, curr, index) => {
    const currPath = `${prev}/${curr}`;
    paths.push(currPath);
    return currPath;
  });
  return paths;
};
//
// const BreadcrumbsItem = ({match, ...rest}) => {
//   const routeName = findRouteName(match.url);
//   if (routeName) {
//     return (
//       match.isExact ?
//         (
//           <BreadcrumbItem active>{routeName}</BreadcrumbItem>
//         ) :
//         (
//           <BreadcrumbItem>
//             <Link to={match.url || ''}>
//               {routeName}
//             </Link>
//           </BreadcrumbItem>
//         )
//     );
//   }
//   return null;
// };
//
// const Breadcrumbs = ({location : {pathname}, match, ...rest}) => {
//   const paths = getPaths(pathname);
//   const items = paths.map((path, i) => <Route key={i++} path={path} component={BreadcrumbsItem}/>);
//   return (
//     <Breadcrumb>
//       {items}
//     </Breadcrumb>
//   );
// };
//
// export default props => (
//   <div>
//     <Route path="/:path" component={Breadcrumbs} {...props} />
//   </div>
// );

import { registerComponent } from 'meteor/vulcan:core';
import React, {Component} from 'react';
import { withRouter } from 'react-router';

const BreadcrumbsItem = ({path, routeName}) => {
  if (routeName) {
    return (
      <BreadcrumbItem>
        <Link to={path || ''}>
          {routeName}
        </Link>
      </BreadcrumbItem>
    );
  }
  return null;
};

class Breadcrumbs extends Component {
  render() {
    console.log('Router, yo:', this.props.router);
    // console.log('routes, yo:', this.props.router.routes[0]);
    const paths = getPaths(this.props.router.location.pathname);
    const items = paths.map((path, i) => <BreadcrumbsItem key={i++} path={path} routeName={this.props.router.routes[this.props.router.routes.length - 1].name}/>);
    return (
      <Breadcrumb>
        {items}
      </Breadcrumb>
    );
  }
}

// class Breadcrumb extends Component {
//   render() {
//     return (
//       <div className="KevinSaysHello">
//         <ol className="breadcrumb">
//           <li className="breadcrumb-item"><a href="#/">Home</a></li>
//           <li className="breadcrumb-item"><a href="#/plugins">Fake</a></li>
//           <li className="active breadcrumb-item">Breadcrumbs</li>
//         </ol>
//       </div>
//     )
//   }
// }

registerComponent('Breadcrumb', Breadcrumbs, withRouter);
