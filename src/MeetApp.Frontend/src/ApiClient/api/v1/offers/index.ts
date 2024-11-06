/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { createOfferCreateResponseFromDiscriminatorValue, createOfferReadResponseFromDiscriminatorValue, serializeOfferCreateRequest, serializeOfferCreateResponse, type OfferCreateRequest, type OfferCreateResponse, type OfferReadResponse } from '../../../models/index.js';
// @ts-ignore
import { OffersItemRequestBuilderRequestsMetadata, type OffersItemRequestBuilder } from './item/index.js';
// @ts-ignore
import { type BaseRequestBuilder, type KeysToExcludeForNavigationMetadata, type NavigationMetadata, type Parsable, type ParsableFactory, type RequestConfiguration, type RequestInformation, type RequestsMetadata } from '@microsoft/kiota-abstractions';
// @ts-ignore
import { type Guid } from 'guid-typescript';

/**
 * Builds and executes requests for operations under /api/v1/offers
 */
export interface OffersRequestBuilder extends BaseRequestBuilder<OffersRequestBuilder> {
    /**
     * Gets an item from the ApiSdk.api.v1.offers.item collection
     * @param id Unique identifier of the item
     * @returns {OffersItemRequestBuilder}
     */
     byId(id: Guid) : OffersItemRequestBuilder;
    /**
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<OfferReadResponse[]>}
     * @throws {OfferReadResponse} error when the service returns a 400 status code
     */
     get(requestConfiguration?: RequestConfiguration<object> | undefined) : Promise<OfferReadResponse[] | undefined>;
    /**
     * @param body The request body
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<OfferCreateResponse>}
     * @throws {OfferCreateResponse} error when the service returns a 400 status code
     */
     post(body: OfferCreateRequest, requestConfiguration?: RequestConfiguration<object> | undefined) : Promise<OfferCreateResponse | undefined>;
    /**
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     */
     toGetRequestInformation(requestConfiguration?: RequestConfiguration<object> | undefined) : RequestInformation;
    /**
     * @param body The request body
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     */
     toPostRequestInformation(body: OfferCreateRequest, requestConfiguration?: RequestConfiguration<object> | undefined) : RequestInformation;
}
/**
 * Uri template for the request builder.
 */
export const OffersRequestBuilderUriTemplate = "{+baseurl}/api/v1/offers";
/**
 * Metadata for all the navigation properties in the request builder.
 */
export const OffersRequestBuilderNavigationMetadata: Record<Exclude<keyof OffersRequestBuilder, KeysToExcludeForNavigationMetadata>, NavigationMetadata> = {
    byId: {
        requestsMetadata: OffersItemRequestBuilderRequestsMetadata,
        pathParametersMappings: ["id"],
    },
};
/**
 * Metadata for all the requests in the request builder.
 */
export const OffersRequestBuilderRequestsMetadata: RequestsMetadata = {
    get: {
        uriTemplate: OffersRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        errorMappings: {
            400: createOfferReadResponseFromDiscriminatorValue as ParsableFactory<Parsable>,
        },
        adapterMethodName: "sendCollection",
        responseBodyFactory:  createOfferReadResponseFromDiscriminatorValue,
    },
    post: {
        uriTemplate: OffersRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        errorMappings: {
            400: createOfferCreateResponseFromDiscriminatorValue as ParsableFactory<Parsable>,
        },
        adapterMethodName: "send",
        responseBodyFactory:  createOfferCreateResponseFromDiscriminatorValue,
        requestBodyContentType: "application/json",
        requestBodySerializer: serializeOfferCreateRequest,
        requestInformationContentSetMethod: "setContentFromParsable",
    },
};
/* tslint:enable */
/* eslint-enable */
