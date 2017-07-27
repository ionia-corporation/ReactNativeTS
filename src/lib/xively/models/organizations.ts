import { Meta, User } from './index';

export module Organizations {
  export interface OrganizationsList {
      meta?: Meta;
      results?: Array<Organization>;
  }

  export interface OrganizationsListResponse {
      /**
       * Error response
       */
      error?: Error;

      /**
       * organizations list object
       */
      organizations?: OrganizationsList;
  }

  export interface Organization {
      /**
       * account identifier
       */
      accountId: string;

      /**
       * Creation date
       */
      created?: Date;

      /**
       * The user who created this item
       */
      createdById?: string;

      /**
       * Item unique identifier
       */
      id?: string;

      /**
       * Last modified date
       */
      lastModified?: Date;

      /**
       * The user who last modified this item
       */
      lastModifiedById?: string;

      /**
       * Organization name
       */
      name: string;

      /**
       * organizationTemplate identifier
       */
      organizationTemplateId?: string;

      /**
       * parent identifier
       */
      parentId?: string;

      /**
       * inline parent (if ?expand=parent)
       */
      parent?: Organization;

      /**
       * Optimistic concurrency version
       */
      version?: string;

      defaultEndUser?: User.EndUser;
  }

  export interface OrganizationsSingleResponse {
      /**
       * Error response
       */
      error?: Error;

      /**
       * Single organizations object
       */
      organization?: Organization;
  }

  export interface OrganizationCreateRequest {
    accountId?: string;
    parentId?: string;
    organizationTemplateId?: string;
    name: string;
    endUserTemplateId?: string;
  }

}
