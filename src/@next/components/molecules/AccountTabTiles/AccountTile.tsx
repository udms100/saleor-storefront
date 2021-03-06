import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { commonMessages } from "@temp/intl";
import { useAccountUpdate, useUserDetails } from "@saleor/sdk";

import { Attribute, IconButton, Tile } from "@components/atoms";

import { AccountUpdateForm } from "./AccountUpdateForm";
import * as S from "./styles";

export const AccountTile: React.FC = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [setAccountUpdate, { data, error }] = useAccountUpdate();
  const { data: user } = useUserDetails();
  const intl = useIntl();

  React.useEffect(() => {
    if (data && !error) {
      setIsEditing(false);
    }
  }, [data, error]);
  return (
    <S.TileWrapper>
      <Tile>
        <S.Wrapper>
          <S.Header>
            <FormattedMessage defaultMessage="MY DATA" />
          </S.Header>
          <S.Content>
            <S.HeaderSmall>
              <FormattedMessage defaultMessage="Personal details" />
              {!isEditing && (
                <IconButton
                  testingContext="editDetailsButton"
                  name="edit"
                  size={22}
                  onClick={() => setIsEditing(isEditing => !isEditing)}
                />
              )}
            </S.HeaderSmall>
            {isEditing ? (
              <AccountUpdateForm
                initialValues={{
                  firstName: (user && user.firstName) || "",
                  lastName: (user && user.lastName) || "",
                }}
                handleSubmit={data => {
                  setAccountUpdate({ input: data });
                }}
                hide={() => {
                  setIsEditing(false);
                }}
              />
            ) : (
              <S.ContentOneLine>
                <Attribute
                  description={intl.formatMessage(commonMessages.firstName)}
                  attributeValue={(user && user.firstName) || "-"}
                />
                <Attribute
                  description={intl.formatMessage(commonMessages.lastName)}
                  attributeValue={(user && user.lastName) || "-"}
                />
              </S.ContentOneLine>
            )}
          </S.Content>
        </S.Wrapper>
      </Tile>
    </S.TileWrapper>
  );
};
