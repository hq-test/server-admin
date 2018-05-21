import React from 'react';
import * as moment from 'moment';
import Countdown from 'react-countdown-now';

var updateDatetime;

class FieldRenderer extends React.Component {
  constructor(props) {
    super(props);
    if (props.type === 'datetime') {
      this.state = {
        startDate: moment(props.value)
      };
    }
  }

  componentDidMount() {
    if (this.props.type === 'datetime') {
      updateDatetime = setInterval(() => {
        this.setState({ startDate: moment(this.props.value) });
      }, 60000);
    }
  }

  componentWillUnmount() {
    if (this.props.type === 'datetime') {
      clearInterval(updateDatetime);
    }
  }

  render() {
    const {
      type,
      fieldName,
      value,
      dependancyFieldValue,
      nested,
      nestedField
    } = this.props;
    switch (type) {
      case 'image':
        return (
          <span>
            <img height="100" src={value} alt={value} />
          </span>
        );

      case 'boolean':
        return <span>{value ? 'Yes' : 'No'}</span>;

      case 'datetime':
        return (
          <span>
            {value ? (
              fieldName === 'endAt' && dependancyFieldValue ? (
                value > new Date().getTime() ? (
                  <Countdown date={value} />
                ) : (
                  moment(value).diff(dependancyFieldValue, 'minutes') +
                  ' Minutes'
                )
              ) : (
                this.state.startDate.fromNow()
              )
            ) : (
              '-'
            )}
          </span>
        );

      case 'price':
        return <span>{value} BHT</span>;

      case 'string':
      default:
        return (
          <span>
            {nested
              ? value && value[nestedField]
                ? value[nestedField]
                : '-'
              : value}
          </span>
        );
    }
  }
}

export default FieldRenderer;
