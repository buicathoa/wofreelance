import { createSlice, current } from '@reduxjs/toolkit'
import { BiddingInterface, BudgetInterface, CurrencyInterface } from '../../interface';


interface postReducer {
    isLoading: boolean,
    currencies: Array<CurrencyInterface>,
    budgets: Array<BudgetInterface>,
    bids: Array<BiddingInterface>,
    totalBids: number,
    personalBids: Array<BiddingInterface>
}

const initialState: postReducer = {
    isLoading: false,
        currencies: [],
        budgets: [],
        bids: [],
        totalBids: 0,
        personalBids: []
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

        getBiddingByIdSuccess: (state, actions) => {
            const bidsClone = []
            return {
                ...state,
            }
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
        },

        createAwardBid: (state, actions) => {},
        createAwardBidSuccess: (state, actions) => {
            let bidsClone = [...state.bids]
            const idxCurrentBid = bidsClone?.findIndex((bid) => bid.id === actions.payload.bidding_id)
            if(idxCurrentBid !== -1) {
                bidsClone[idxCurrentBid] = {...bidsClone[idxCurrentBid], award: actions.payload}
                bidsClone = bidsClone?.map((bid) => {
                    if(bid.id !== actions.payload.bidding_id) {
                        return {...bid, award: null}
                    } else {
                        return {...bid}
                    }
                })
            }
            return {
                ...state,
                bids: bidsClone
            }
        },

        updateAwardBid: (state, actions) => {},
        updateAwardBidSuccess: (state, actions) => {
            let bidsClone = [...state.bids]
            let personalBidsClone = [...state.personalBids]

            const idxCurrentBid = bidsClone?.findIndex((bid) => bid.id === actions.payload.bidding_id)
            const idxCurrentPersonalBid = personalBidsClone?.findIndex((bid) => bid.id === actions.payload.bidding_id)
            if(idxCurrentBid !== -1) {
                bidsClone[idxCurrentBid] = {...bidsClone[idxCurrentBid], award: {...bidsClone[idxCurrentBid]?.award,...actions.payload} }
            }
            if(idxCurrentPersonalBid !== -1) {
                personalBidsClone[idxCurrentPersonalBid] = {...personalBidsClone[idxCurrentPersonalBid], award: {...personalBidsClone[idxCurrentPersonalBid]?.award, ...actions.payload}}
            }
            return {
                ...state,
                bids: bidsClone,
                personalBids: personalBidsClone
            }
        },
        
        deleteAwardBid: (state, actions) => {},
        deleteAwardBidSuccess: (state, actions) => {
            let bidsClone = [...state.bids]
            let personalBidsClone = [...state.personalBids]

            const idxCurrentBid = bidsClone?.findIndex((bid) => bid.id === actions.payload.bidding_id)
            const idxCurrenPersonalBid = personalBidsClone?.findIndex((bid) => bid?.id === actions.payload.bidding_id)
            if(idxCurrentBid !== -1) {
                bidsClone[idxCurrentBid] = {...bidsClone[idxCurrentBid], award: null }
            }

            if(idxCurrenPersonalBid !== -1) {
                personalBidsClone[idxCurrenPersonalBid] = {...personalBidsClone[idxCurrenPersonalBid], award: null}
            }
            return {
                ...state,
                bids: bidsClone,
                personalBids: personalBidsClone
            }
        },

        acceptAwardBid: (state, actions) => {},
        acceptAwardBidSuccess: (state, actions) => {
            const bidsClone: Array<any> = [...state.bids]?.map((bid) => {
                console.log([...state.bids])
                if(bid.id === actions.payload.bidding_id) {
                    return {...bid, bidding_status: 'awarded'}
                } else {
                    if(bid?.award) {
                        return {...bid, bidding_status: 'rejected'}
                    }
                }
            })

            const personalBidsClone: Array<any> = [...state.personalBids]?.map((bid) => {
                console.log([...state.bids])
                if(bid.id === actions.payload.bidding_id) {
                    return {...bid, bidding_status: 'awarded'}
                } else {
                    if(bid?.award) {
                        return {...bid, bidding_status: 'rejected'}
                    } else {
                        return {...bid}
                    }
                }
            })
            return {
                ...state,
                bids: bidsClone,
                personalBids: personalBidsClone
            }
        },
        
        getAllPersonalBiddings: (state, actions) => {},
        getAllPersonalBiddingsSuccess: (state, actions) => {
            return {
                ...state,
                personalBids: actions.payload
            }
        },
        awardBidResponse: (state, actions) => {
            let personalBidsClone  = [...state.personalBids]
            let bidsClone = [...state.bids]
            const {bid, ...others} = actions.payload

            const idxBid = bidsClone?.findIndex((bid) => bid.id === actions?.payload?.bidding_id)
            if(actions?.payload?.status === 'create' || actions?.payload?.status === 'update') {
                const idxPersonalBid = personalBidsClone?.findIndex((bid) => bid.id === actions.payload.bidding_id)

                if(idxPersonalBid !== -1) {
                    personalBidsClone[idxPersonalBid] = {...personalBidsClone[idxPersonalBid], award: others}
                }
                
                if(idxBid !== -1) {
                    bidsClone[idxBid] = {...bidsClone[idxBid], award: others}
                }
            } else if(actions?.payload?.status === 'removed'){
                const idxBidAward = personalBidsClone?.findIndex((bid) => bid.award)

                if(idxBidAward !== -1) {
                    personalBidsClone[idxBidAward] = {...personalBidsClone[idxBidAward], award: null}
                }
                if(idxBid !== -1) {
                    bidsClone[idxBid] = {...bidsClone[idxBid], award: null}
                }
            } else if(actions?.payload?.status === 'awarded'){
                personalBidsClone = personalBidsClone?.map(bid => {
                    if(bid?.id === actions?.payload?.bidding_id) {
                        return {...bid, bidding_status: 'awarded'}
                    } else {
                        return {...bid, bidding_status: 'rejected'}
                    }
                })

                bidsClone = bidsClone?.map(bid => {
                    if(bid?.id === actions?.payload?.bidding_id) {
                        return {...bid, bidding_status: 'awarded'}
                    } else {
                        return {...bid, bidding_status: 'rejected'}
                    }
                })
            }
            return {
                ...state,
                personalBids: personalBidsClone,
                bids: bidsClone
            }
        },

    })
})

export const PostActions = Post.actions;

const PostReducer = Post.reducer;
export default PostReducer;