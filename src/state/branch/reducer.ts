import * as TYPES from './types'
import type { BranchState, BranchAction } from './types'

export const branchReducer = (state: BranchState = TYPES.INITIAL_STATE, action: BranchAction): BranchState => {
  switch (action.type) {
    // Get branches
    case TYPES.GET_BRANCHES:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case TYPES.GET_BRANCHES_SUCCESS:
      return {
        ...state,
        branchList: action.payload,
        loading: false,
        error: null,
      }
    case TYPES.GET_BRANCHES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    // Get branch by ID
    case TYPES.GET_BRANCH_BY_ID:
      return {
        ...state,
        itemLoading: true,
        error: null,
      }
    case TYPES.GET_BRANCH_BY_ID_SUCCESS:
      return {
        ...state,
        currentBranch: action.payload,
        itemLoading: false,
        error: null,
      }
    case TYPES.GET_BRANCH_BY_ID_ERROR:
      return {
        ...state,
        itemLoading: false,
        error: action.payload,
      }

    // Create branch
    case TYPES.CREATE_BRANCH:
      return {
        ...state,
        creating: true,
        error: null,
      }
    case TYPES.CREATE_BRANCH_SUCCESS:
      return {
        ...state,
        branchList: [...state.branchList, action.payload],
        creating: false,
        error: null,
        success: true,
        successMessage: 'Branch created successfully',
      }
    case TYPES.CREATE_BRANCH_ERROR:
      return {
        ...state,
        creating: false,
        error: action.payload,
      }

    // Update branch
    case TYPES.UPDATE_BRANCH:
      return {
        ...state,
        updating: true,
        error: null,
      }
    case TYPES.UPDATE_BRANCH_SUCCESS:
      return {
        ...state,
        branchList: state.branchList.map((branch) =>
          branch.id === action.payload.id ? action.payload : branch
        ),
        currentBranch: action.payload,
        updating: false,
        error: null,
        success: true,
        successMessage: 'Branch updated successfully',
      }
    case TYPES.UPDATE_BRANCH_ERROR:
      return {
        ...state,
        updating: false,
        error: action.payload,
      }

    // Delete branch
    case TYPES.DELETE_BRANCH:
      return {
        ...state,
        deleting: true,
        error: null,
      }
    case TYPES.DELETE_BRANCH_SUCCESS:
      return {
        ...state,
        branchList: state.branchList.filter((branch) => branch.id !== action.payload),
        currentBranch: null,
        deleting: false,
        error: null,
        success: true,
        successMessage: 'Branch deleted successfully',
      }
    case TYPES.DELETE_BRANCH_ERROR:
      return {
        ...state,
        deleting: false,
        error: action.payload,
      }

    // Clear actions
    case TYPES.CLEAR_SUCCESS:
      return {
        ...state,
        success: false,
        successMessage: '',
      }
    case TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}
