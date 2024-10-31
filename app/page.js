'use client'
// import DialogueOverlay from './components/DialogueOverlay'
import TextOverlayImage from './components/TextOverlayImage'
import React, { useEffect, useState } from 'react'

export default function Home() {
  const [comicList, setComicList] = useState([])
  const csv2json = (str, delimiter = ',') => {
    const titles = str.slice(0, str.indexOf('\n')).split(delimiter)
    const rows = str.slice(str.indexOf('\n') + 1).split('\n')
    let list = rows.map((row) => {
      const values = row.split(',')
      const values2 = row.split('"')
      const values3 = row.split(']",')
      return titles.reduce((object, curr, i) => {
        if (i === 2) {
          return (object[curr] = values2[1]), object
        }
        if (i === 3) {
          let value = values3[1] ? values3[1].toString() : values3[1]
          return (object[curr] = value), object
        }
        return (object[curr] = values[i]), object
      }, {})
    })

    const mergedData = list.reduce((acc, item) => {
      const existing = acc.find((i) => i.old_image === item.old_image)
      let coordinatesArray = JSON.parse(item.coordinates ?? '[]')
      if (coordinatesArray[0]) {
        let width = (coordinatesArray[1][0] - coordinatesArray[0][0])
        let height = (coordinatesArray[2][1] - coordinatesArray[1][1])
        if (existing) {
          existing.dialogues = [
            ...existing.dialogues,
            {
              x: coordinatesArray[0][0],
              y: coordinatesArray[1][1],
              text: item.content,
              width,
              height,
            },
          ]
        } else {
          acc.push({
            ...item,
            dialogues: [
              {
                x: coordinatesArray[0][0],
                y: coordinatesArray[0][1],
                text: item.content,
                width,
                height,
              },
            ],
          })
        }
      }
      return acc
    }, [])

    return mergedData
  }

  const getData = async () => {
    let data = await fetch('/sample/image_info.csv').then((resp) => resp.text())
    let word_array = await csv2json(data)
    setComicList(word_array)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}>
      <div>
        <h1
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            marginTop: '16px',
          }}>
          Comic Test
        </h1>

        <div style={{
          pointerEvents: 'none',
        }}>
          {comicList.map((item, index) => {
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  position: 'relative',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}>
                <div
                  style={{
                    position: 'relative',
                    pointerEvents: 'none',
                  }}>
                  <TextOverlayImage
                    // src={`/sample/image_input/${item?.old_image}`}
                    src={`/sample/image_output/${item?.new_image}`}
                    value={item?.dialogues}
                    // fontSize={32}
                    color='red'
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

