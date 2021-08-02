import React from 'react'
import styled from 'styled-components'
import { Text, Heading, Link, Image } from '@saltswap/uikit'
import useI18n from 'hooks/useI18n'

const LayoutWrapper = styled.div`
  max-width: 500px;
  margin: 0 auto 40px;
  display: flex;
  flex-direction: column;
`

const StyledHeading = styled(Heading)`
  margin: 16px 0;
`

const StyledImage = styled(Image)`
  align-self: center;
`

const StyledLink = styled(Link)`
  align-self: center;
  margin-top: 16px;
`

const HowItWorks = () => {
  const TranslateString = useI18n()

  return (
    <LayoutWrapper>

      <StyledHeading size="lg" as="h3" color="secondary">
        {TranslateString(632, 'How it works')}
      </StyledHeading>
      <Text fontSize="16px">
        {TranslateString(
          999,
          'Spend OWL to buy tickets, contributing to the lottery pot. Win prizes if 2, 3, or 4 of your ticket numbers match the winning numbers and their exact order!',
        )}
      </Text>
      <StyledLink href="https://owld.gitbook.io/docs/core-product/lottery">Read more</StyledLink>
    </LayoutWrapper>
  )
}

export default HowItWorks