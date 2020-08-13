import React, { useState } from 'react'
import { TimeSplit } from './typings/global'
import { tick } from './utils/time'
import { useCssHandles } from 'vtex.css-handles'

import { useQuery } from 'react-apollo'
import useProduct from 'vtex.product-context/useProduct'
import productReleaseDate from './queries/productReleaseDate.graphql'

interface CountdownProps { 
  targetDate: string
}

const DEFAULT_TARGET_DATE = (new Date('2020-06-25')).toISOString()
const CSS_HANDLES = ['countdown']

const Countdown: StorefrontFunctionComponent<CountdownProps> = () => {
  const [ timeRemaining, setTime ] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  })

  const { product } = useProduct()
  const { linkText } = product
  // const productContext = useProduct()
  // const product = productContext?.product
  // const linkText = productContext?.linkText
  const { data, loading, error } = useQuery(productReleaseDate, {
    variables: {
      slug: linkText
    },
    ssr: false
  })

  const handles = useCssHandles(CSS_HANDLES)

  tick(data?.product?.releaseDate || DEFAULT_TARGET_DATE, setTime)

  if (loading) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <span>Erro!</span>
      </div>
    )
  }

  if (!product) {
    return (
      <div>
        <span>Não há contexto de produto</span>
      </div>
    )
  }

  console.log('data', {data})

  return (
    <div className={`${handles.countdown} t-heading-2 fw3 w-100 c-muted-1 db tc`}>
      { `${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}` }
    </div>
  )
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
    targetDate: {
      title: 'editor.countdown.targetDate.title',
      description: 'Data final utilizada no contador',
      type: 'string',
      default: null,
    },
  },
}

export default Countdown
