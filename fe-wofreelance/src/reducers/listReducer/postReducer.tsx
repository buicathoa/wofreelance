import { createSlice, current } from '@reduxjs/toolkit'
import { BiddingInterface, BudgetInterface, CurrencyInterface } from '../../interface';


interface postReducer {
    isLoading: boolean,
    currencies: Array<CurrencyInterface>,
    budgets: Array<BudgetInterface>,
    bids: Array<BiddingInterface>,
    totalBids: number
}

const initialState: postReducer = {
    isLoading: false,
        currencies: [],
        budgets: [],
        bids: [],
        totalBids: 0
}

const Post = createSlice({
    name: 'post',
    initialState,
    reducers: ({
        createPost: (state, actions) => {},
        getPostDetail: (state, actions) => {},
        getallBid: (state, actions) => {},
        getallBidSuccess: (state, actions) => {
            state.bids = actions.payload.items;
            state.totalBids = actions.payload.totalRecord
        },
        biddingPost: (state, actions) => {},
        biddingPostSuccess: (state, actions) => {
            state.bids = [...state.bids, actions.payload];
            state.totalBids += 1
        },
        updateBid: (state, actions) => {},
        updateBidSuccess: (state, actions) => {
            const bidFound = [...state.bids].findIndex((bid) => bid.id === actions.payload.id);
            state.bids[bidFound] = actions.payload
        },

        deleteBid: (state, actions) => {},
        deleteBidSuccess: (state, actions) => {
            state.bids = [...state.bids]?.filter(bid => bid.id !== actions.payload.id)
            state.totalBids -= 1
        },
        updateBidRoomId: (state, actions) => {
            const bidsClone = [...state.bids]
            const currentBid = bidsClone?.findIndex((bid) => bid.id === actions.payload.bidding_id)
            bidsClone[currentBid] = {...bidsClone[currentBid], room_id: actions.payload.room_id}
            return {
                ...state,
                bids: bidsClone
            }
        },
        userAuthenSocket: (state, actions) => {
            const bidsClone = [...state.bids]
            const currentBid = bidsClone?.findIndex((bid) => bid.user.id === actions.payload.user_id)
            bidsClone[currentBid] = {...bidsClone[currentBid], user: {...bidsClone[currentBid].user, user_active: actions.payload.status === 'login' ? true : false}}
            return {
                ...state,
                bids: bidsClone
            }
        }
    })
})

export const PostActions = Post.actions;

const PostReducer = Post.reducer;
export default PostReducer;