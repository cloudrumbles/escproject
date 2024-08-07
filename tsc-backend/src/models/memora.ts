import axios, { AxiosResponse } from 'axios';
import AppError from '../utils/appError';
import axiosRetry from 'axios-retry';
import { HotelPricesResult, RoomResponse, HotelAPIResponse, QueryParams } from './types';

const ascendaAPI = "https://hotelapi.loyalty.dev";

const formatURL = (endpoint: string): string => {
    return ascendaAPI + endpoint;
};

export const retrieveAvailableHotels = async (params: QueryParams): Promise<HotelPricesResult> => {
    let res: AxiosResponse<HotelPricesResult>;
    try {
        for (let i = 0; i < 6; i++) {
            res = await axios({
                method: "get",
                url: formatURL("/api/hotels/prices"),
                params: params,
                retry: 3,
                retryDelay: 300,
            });

            if (res.data.completed) {
                break;
            }

            await new Promise(resolve => setTimeout(resolve, i * 3000));
            console.log('repolling');
        }

        if (!res.data.completed) {
            throw new AppError(503, 'error', 'server timeout');
        }

        return res.data;
    } catch (exception) {
        throw exception;
    }
};

export const retrieveAvailableHotelRooms = async (hotel_id: string, params: QueryParams): Promise<RoomResponse> => {
    try {
        let res: AxiosResponse<RoomResponse>;
        for (let i = 0; i < 6; i++) {
            res = await axios({
                method: "get",
                url: formatURL(`/api/hotels/${hotel_id}/price`),
                params: params,
            });

            if (res.data.completed) {
                break;
            }

            await new Promise(resolve => setTimeout(resolve, i * 3000));
            console.log('repolling');
        }

        if (!res.data.completed) {
            throw new AppError(503, 'error', 'server timeout');
        }

        return res.data;
    } catch (exception) {
        throw exception;
    }
};

export const retrieveHotelsByDestinationID = async (destination_id: string): Promise<HotelAPIResponse[]> => {
    try {
        const response = await axios({
            method: "get",
            url: formatURL("/api/hotels"),
            params: { destination_id },
        });
        return response.data;
    } catch (exception) {
        throw exception;
    }
};

export const retrieveStaticHotelDetailByHotelID = async (hotel_id: string): Promise<HotelAPIResponse> => {
    try {
        const response = await axios({
            method: "get",
            url: formatURL(`/api/hotels/${hotel_id}`),
        });
        return response.data;
    } catch (exception) {
        throw exception;
    }
};