import { createSlice } from '@reduxjs/toolkit'
import { ChatReducerInterface } from '../../interface';

interface chatReducer {
    interactions: Array<ChatReducerInterface>
}

// chat_window_status: open, hide, close, focus

const initialState: chatReducer = {
    interactions: [],
}

const Chat = createSlice({
    name: 'chat',
    initialState,
    reducers: ({
        addInteraction: (state, actions) => {
            const idxCurrentInteraction = [...state.interactions]?.findIndex(interaction => interaction.user.id === actions.payload.user.id && interaction.message_title === actions.payload.message_title)
            const idxCurrentFocus = [...state.interactions]?.findIndex((interaction) => interaction.chat_window_status === 'focus')
            state.interactions[idxCurrentFocus] = {...state.interactions[idxCurrentFocus], chat_window_status: 'open'}
            if(idxCurrentInteraction === -1) {
                state.interactions = [...state.interactions, {...actions.payload, chat_window_status: 'focus'}]
            } else {
                state.interactions[idxCurrentInteraction] = {...state.interactions[idxCurrentInteraction], chat_window_status: 'focus'}
            }
        },
        modifyInteraction: (state, actions) => {
            const idxCurrentInteraction =  [...state.interactions]?.findIndex((interaction) =>  interaction.user.id === actions.payload.user.id && interaction.message_title === actions.payload.message_title)
            const idxCurrentFocus = [...state.interactions]?.findIndex((interaction) => interaction.chat_window_status === 'focus')
            if(idxCurrentInteraction === idxCurrentFocus) {
                state.interactions[idxCurrentInteraction] = {...state.interactions[idxCurrentInteraction], chat_window_status: actions.payload.chat_window_status}
            } else {
                state.interactions[idxCurrentInteraction] = {...state.interactions[idxCurrentInteraction], chat_window_status: actions.payload.chat_window_status}
                state.interactions[idxCurrentFocus] = {...state.interactions[idxCurrentFocus], chat_window_status: 'open'}
            }
        }
    })
})

export const ChatActions = Chat.actions;

const ChatReducer = Chat.reducer;
export default ChatReducer;