'use client'
import { useEffect, useState } from 'react'
// data
import data from '@/assets/questions.json'
// @mui
import { Alert, Card, Container, InputAdornment, List, ListItem, ListItemText, Snackbar, TextField, Typography } from '@mui/material'
// components
import Iconify from '@/components/iconify'
// type
import { Question } from '@/@types/question'
// utils
import { highlightText } from '@/utils/highlight'
import EmptyContent from '@/components/empty-content'

export default function page() {
  const [filterName, setFilterName] = useState<string>('')

  const onFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value)
  }

  // const isFiltered = filterName !== ''
  useEffect(() => {
    // let dataTemp = data
    // for (let i = 0; i < dataTemp.length; i++) {
    //   for (let j = i + 1; j < dataTemp.length; j++) {
    //     if (dataTemp[i].question === dataTemp[j].question) {
    //       console.log(dataTemp[j].question)
    //     }
    //   }
    // }
  }, [])

  const dataFiltered = applyFilter({
    inputData: data,
    filterName,
  });

  const isNotFound = (!dataFiltered.length && !!filterName);

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
        <List sx={{ mt: 2 }}>
          {dataFiltered.map(item => {
            return (
              <ListItem
                key={item.question.toLowerCase()}
                sx={{
                  mb: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 4,
                  padding: 2,
                  alignItems: 'flex-start',
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1">{highlightText(item.question, filterName)}</Typography>
                  }
                  secondary={
                    <Typography variant="h6" color="info">Answer: {item.answer}</Typography>
                  }
                />
              </ListItem>
            )
          })}
        </List>
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

  return inputData;
}