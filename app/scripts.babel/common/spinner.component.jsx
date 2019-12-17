import React from 'react';

class Spinner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible
    }
  }

  render() {
    return (
      <React.Fragment>
        {
          this.state.visible &&
          (
            <div className="lds-spinner"><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div><div>
            </div><div></div><div></div><div></div><div></div></div>
          )
        }
      </React.Fragment>
    )
  }
}

export default Spinner;
