import React from "react";

const { Provider: ServiceProvider, Consumer: ServiceConsumer } =
  React.createContext();

const withService = (Wrapped) => {
  return (props) => {
    return (
      <ServiceConsumer>
        {(api) => {
          return <Wrapped {...props} service={api} />;
        }}
      </ServiceConsumer>
    );
  };
};

export { withService, ServiceProvider, ServiceConsumer };
