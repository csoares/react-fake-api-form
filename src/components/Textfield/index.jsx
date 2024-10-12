import PropTypes from "prop-types";

const TextField = ({ label, name, value, onChange, type = "text" }) => {
  return (
    <div>
      <label>
        {label}:
        <input type={type} name={name} value={value} onChange={onChange} />
      </label>
    </div>
  );
};

// Adding PropTypes validation
TextField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string, // No need for defaultProps as default value is set in function signature
};

export default TextField;
