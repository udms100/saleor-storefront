import "./scss/index.scss";

import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { commonMessages } from "@temp/intl";

import { Button, Form, TextField } from "..";
import { TypedPasswordResetMutation } from "./queries";

import { passwordResetUrl } from "../../app/routes";
import { ResetPassword } from "./gqlTypes/ResetPassword";

const PasswordResetForm: React.FC = () => {
  const intl = useIntl();

  const disableSubmit = (loading: boolean, data: ResetPassword) => {
    if (loading) {
      return true;
    }
    if (data?.requestPasswordReset.errors.length === 0) {
      return true;
    }
    return false;
  };

  const buttonMessage = (loading: boolean, data: ResetPassword) => {
    if (loading) {
      return intl.formatMessage(commonMessages.loading);
    }
    if (data?.requestPasswordReset.errors.length === 0) {
      return intl.formatMessage({ defaultMessage: "Check your inbox" });
    }
    return intl.formatMessage({ defaultMessage: "Reset password" });
  };

  return (
    <div className="password-reset-form">
      <p>
        <FormattedMessage defaultMessage="Please provide us your email address so we can share you a link to reset your password" />
      </p>
      <TypedPasswordResetMutation>
        {(passwordReset, { loading, data }) => {
          return (
            <Form
              errors={data?.requestPasswordReset.errors || []}
              onSubmit={(event, { email }) => {
                event.preventDefault();
                passwordReset({
                  variables: {
                    email,
                    redirectUrl: `${window.location.origin}${passwordResetUrl}`,
                  },
                });
              }}
            >
              <TextField
                name="email"
                autoComplete="email"
                label={intl.formatMessage(commonMessages.eMail)}
                type="email"
                required
              />
              <div className="password-reset-form__button">
                <Button
                  testingContext="submit"
                  type="submit"
                  {...(disableSubmit(loading, data) && { disabled: true })}
                >
                  {buttonMessage(loading, data)}
                </Button>
              </div>
            </Form>
          );
        }}
      </TypedPasswordResetMutation>
    </div>
  );
};

export default PasswordResetForm;
