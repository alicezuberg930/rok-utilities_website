'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList, ListChildComponentProps } from 'react-window'
// data
import data from '@/assets/questions.json'
// import newData from '@/assets/rok_questions.json'
// @mui
import { Alert, Box, Container, InputAdornment, List, ListItem, ListItemText, Snackbar, TextField, Typography } from '@mui/material'
// components
import Iconify from '@/components/iconify'
import EmptyContent from '@/components/empty-content'
// type
import { Question } from '@/@types/question'
// utils
import { highlightText } from '@/utils/highlight'
// hooks
import useDebounce from '@/hooks/useDebounce'

export default function page() {
  const [filterName, setFilterName] = useState<string>('')
  const debouncedFilterName = useDebounce(filterName, 400)
  const listRef = useRef<VariableSizeList>(null)
  const listOuterRef = useRef<HTMLDivElement | null>(null)
  const sizeMap = useRef<{ [key: number]: number }>({})

  useEffect(() => {
    if (listOuterRef.current) {
      listOuterRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [debouncedFilterName])

  // get and set height of item
  const getSize = (index: number) => sizeMap.current[index] || 100
  const setSize = (index: number, size: number) => {
    if (sizeMap.current[index] !== size) {
      sizeMap.current = { ...sizeMap.current, [index]: size }
      listRef.current?.resetAfterIndex(index)
    }
  }

  // Virtualized row renderer
  const Row = ({ index, style, data }: ListChildComponentProps<{ data: Question[], setSize: Function }>) => {
    const rowRef = useRef<HTMLDivElement>(null)
    const { data: items, setSize } = data
    const item = items[index]

    // Measure height
    const measure = useCallback((node: HTMLDivElement | null) => {
      if (node) {
        const height = node.getBoundingClientRect().height
        setSize(index, height)
      }
    }, [index, setSize])

    return (
      <Box
        ref={(node: HTMLDivElement | null) => {
          rowRef.current = node
          measure(node)
        }}
        key={item.question.toLowerCase()}
        style={style}
        sx={{
          p: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 4,
        }}
      >
        <Typography variant='subtitle1'>
          {highlightText(item.question, debouncedFilterName)}
        </Typography>
        <Typography variant='h6' color='info'>
          Answer: {item.answer}
        </Typography>
      </Box>
    )
  }

  const onFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value)
  }

  // const isFiltered = filterName !== ''

  const dataFiltered = applyFilter({
    inputData: data,
    filterName: debouncedFilterName,
  })

  const isNotFound = (!dataFiltered.length && !!debouncedFilterName)

  return (
    <Container maxWidth='lg'>
      <TextField
        sx={{
          marginTop: 4,
          '& .MuiOutlinedInput-root': { borderRadius: 4 }
        }}
        fullWidth
        value={filterName}
        onChange={onFilterName}
        placeholder='Search for questions'
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position='start'>
                <Iconify icon='eva:search-fill' sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }
        }}
      />
      {isNotFound ? (
        <EmptyContent
          sx={{ width: '100%' }}
          title='No results found'
          description='No answers were found for this question'
        />
      ) : (
        <Box sx={{ my: 2, height: '85vh' }}>
          <AutoSizer>
            {
              ({ height, width }) => (
                <VariableSizeList
                  ref={listRef}
                  outerRef={listOuterRef}
                  height={height}
                  itemCount={dataFiltered.length}
                  itemSize={getSize}
                  itemData={{ data: dataFiltered, setSize }}
                  width={width}
                >
                  {Row}
                </VariableSizeList>
              )
            }
          </AutoSizer>
        </Box>
        // <List sx={{ mt: 2 }}>
        //   {dataFiltered.map(item => {
        //     return (
        //       <ListItem
        //         key={item.question.toLowerCase()}
        //         sx={{
        //           mb: 2,
        //           border: '1px solid',
        //           borderColor: 'divider',
        //           borderRadius: 4,
        //           padding: 2,
        //           alignItems: 'flex-start',
        //         }}
        //       >
        //         <ListItemText
        //           primary={
        //             <Typography variant='subtitle1'>{highlightText(item.question, debouncedFilterName)}</Typography>
        //           }
        //           secondary={
        //             <Typography variant='h6' color='info'>Answer: {item.answer}</Typography>
        //           }
        //         />
        //       </ListItem>
        //     )
        //   })}
        // </List>
      )}
    </Container>
  )
}

// Filter function
const applyFilter = ({
  inputData = [],
  filterName
}: {
  inputData: Question[],
  filterName: string
}) => {
  if (filterName) {
    inputData = inputData.filter((question) => question.question.toLowerCase().indexOf(filterName.toLowerCase()) !== -1)
  }

  return inputData
}