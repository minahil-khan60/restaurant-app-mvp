# Restaurant App MVP - Fall 2026

## Installation
- Node: v18+
- Steps: npm install → npx expo start → Open in Expo Go or Android Emulator

## Mock Login Credentials
- **Customer:** customer@test.com / customer123
- **Manager:** manager@test.com / manager123

## Hooks Used Per Screen (Q10 Requirement)
| Screen | Hooks Used | Why |
|---|---|---|
| LoginScreen | useState, useForm | Form inputs, validation, mode toggle |
| MenuScreen | useState, useEffect, useRef, useMemo, useCallback | Fetch menu, filter, scrollToTop, optimization |
| CartScreen | useReducer, useContext (Cart) | Complex cart actions |
| ProfileScreen | useContext (Auth, Theme) | Show user, toggle theme, logout |
| ReservationScreen | useReservation, useForm, useState | Booking logic |
| OrderTracking | useEffect (timers), useState | Auto status 10s,20s,30s + elapsed counter |
| Manager Dashboard | useContext, useState, useEffect | Manage orders/reservations/menu |

## Q6 - Why Context over Prop Drilling?
Auth and Theme are needed in almost every screen. Prop drilling would pass through 4-5 levels making code messy. Context gives global access with one Provider. Drawback: All consumers re-render when context changes.

## Q7 - Cart Reducer Test Cases (6)
| Action | Initial State | Expected |
|---|---|---|
| ADD_ITEM id1 | {items: []} | {items: [{id:1, qty:1}]} |
| INCREMENT id1 | {qty:1} | {qty:2} |
| DECREMENT id1 qty1 | {qty:1} | {items: []} removed |
| REMOVE_ITEM | {items:[{id:1}]} | {items: []} |
| APPLY_PROMO WELCOME10 | {discount:0} | {discount:10} |
| CLEAR_CART | {items: 2} | {items:[], discount:0} |

**useReducer vs useState:** Cart has multiple related transitions, so useReducer keeps logic pure and testable in one place. useState is enough for simple value like selectedCategory.

## Q8 - When NOT to use useMemo/useCallback
Do not use for cheap calculations or when deps change every render. It adds memory overhead. Use only for heavy calc (total price) or with React.memo.

## Q4 Note - Empty Dependency Array
If filtering effect deps is [], it runs only once on mount. When selectedCategory changes, UI shows stale data. So include [selectedCategory, menuItems].

## Screenshots
In /screenshots folder

## Demo Video
Paste your 3-min drive link here after recording
