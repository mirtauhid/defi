import { Button, Flex, Text } from '@saltswap/uikit'
import BigNumber from 'bignumber.js'
import UnlockButton from 'components/UnlockButton'
import { useApprove } from 'hooks/useApprove'
import useI18n from 'hooks/useI18n'
import React, { useCallback, useMemo, useState } from 'react'
import { useFarmFromSymbol, useFarmUser } from 'state/hooks'
import { Farm } from 'state/types'
import styled from 'styled-components'
import { getAddress } from 'utils/addressHelpers'
import { getContract } from 'utils/erc20'
import { provider } from 'web3-core'
import HarvestAction from './HarvestAction'
import StakeAction from './StakeAction'

const Action = styled.div`
  padding-top: 16px;
`
export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  ethereum?: provider
  account?: string
  addLiquidityUrl?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, ethereum, account, addLiquidityUrl }) => {
  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses } = useFarmFromSymbol(farm.lpSymbol)
  const { allowance, tokenBalance, stakedBalance, earnings } = useFarmUser(pid)
  const lpAddress = getAddress(lpAddresses)
  const lpName = farm.lpSymbol.toUpperCase()
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const lpContract = useMemo(() => getContract(ethereum as provider, lpAddress), [ethereum, lpAddress])

  const { onApprove } = useApprove(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])

  const renderApprovalOrStakeButton = () =>
    isApproved ? (
      <StakeAction
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        tokenName={lpName}
        pid={pid}
        addLiquidityUrl={addLiquidityUrl}
      />
    ) : (
      <Button mt="8px" fullWidth disabled={requestedApproval} onClick={handleApprove}>
        {TranslateString(758, 'Approve Contract')}
      </Button>
    )

  return (
    <Action>
      <Flex>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="3px">
          CAKE
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {TranslateString(1072, 'Earned')}
        </Text>
      </Flex>
      <HarvestAction earnings={earnings} pid={pid} />
      <Flex>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="3px">
          {lpName}
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {TranslateString(1074, 'Staked')}
        </Text>
      </Flex>
      {!account ? <UnlockButton mt="8px" fullWidth /> : renderApprovalOrStakeButton()}
    </Action>
  )
}

export default CardActions
