export enum NotifType {
    WIN = 'WIN',
    NEW_BID = 'NEW_BID',
    OUTBID = 'OUTBID',
    SOMEONEBIDYOURITEM = 'SOMEONEBIDYOURITEM',
    AUCTIONENDED = 'AUCTIONENDED',
    NEWITEMLISTED = 'NEWITEMLISTED',
    BIDDINGCLOSESOON = 'BIDDINGCLOSESOON',
    OUTBIDONYOURITEM = 'OUTBIDONYOURITEM',
    DEFAULT = 'DEFAULT',
    AUCTION_END = 'AUCTION_END'
  }
  
  export interface NotificationResponse {
    content: {
      id: number;
      userId: number;
      message: string;
      type: NotifType;
      timestamp: string;
      read: boolean;
      auctionId?: string;
    }[];
    pageable: {
      pageNumber: number;
      pageSize: number;
    };
    totalElements: number;
  }
  
  export interface Notification {
    _id: string;
    user: string;
    type: NotifType;
    message: string;
    isRead: boolean;
    createdAt: Date;
    auctionId?: string;
  }