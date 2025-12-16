import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { GoalsProvider } from './context/GoalsContext'
import { ContactsProvider } from './context/ContactsContext'
import { MandatProvider } from './context/MandatContext'
import { AnnonceProvider } from './context/AnnonceContext'
import { BuyerProvider } from './context/BuyerContext'
import { SellerLeadsProvider } from './context/SellerLeadsContext'
import { CalendarProvider } from './context/CalendarContext'
import theme from './theme/theme'
import router from './routes'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ContactsProvider>
        <MandatProvider>
          <SellerLeadsProvider>
            <GoalsProvider>
              <CalendarProvider>
                <AnnonceProvider>
                  <BuyerProvider>
                    <RouterProvider router={router} />
                  </BuyerProvider>
                </AnnonceProvider>
              </CalendarProvider>
            </GoalsProvider>
          </SellerLeadsProvider>
        </MandatProvider>
      </ContactsProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
