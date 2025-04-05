// src/BeamsSetup.js
import React, { useEffect, useContext } from "react";
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import { AuthContext } from "./context/AuthContext";
import axios from "axios";

const API_URL =  "https://api.gritfit.site/api";

const BEAMS_INSTANCE_ID = process.env.REACT_APP_BEAMS_INSTANCE_ID;

function BeamsSetup() {
  const { accessToken, user } = useContext(AuthContext);

  useEffect(() => {
    // Only do this if the user is logged in
    if (!accessToken || !user) return;

    // 1) Create Beams client
    const beamsClient = new PusherPushNotifications.Client({
      instanceId: BEAMS_INSTANCE_ID, 
    });

    // 2) Start to request permission
    beamsClient.start()
      .then(() => {
        // 3) Optionally subscribe to an "interest" for targeted pushes
        // e.g., user-<userid>
        return beamsClient.addDeviceInterest(`user-${user.id}`);
      })
      .then(async () => {
        // 4) Optionally get the device ID (if you want to store it in DB)
        const deviceId = await beamsClient.getDeviceId();
        // console.log("Beams device ID:", deviceId);

        // Optionally store deviceId in DB if you want:
        await axios.post(`${API_URL}/storeBeamsDevice`, 
          { deviceId },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      })
      .catch(err => {
        console.error("Beams registration failed:", err);
      });
  }, [accessToken, user]);

  return null;
}

export default BeamsSetup;
