package com.webstart.service;

import com.webstart.DTO.*;
import org.json.simple.JSONObject;

import java.security.Timestamp;
import java.util.Date;
import java.util.List;

/**
 * Created by George on 21/6/2016.
 */
public interface ObservationProperyService {
    JSONObject getAllObsPropeties();
    String getObservationsData(Long obspropId, int userId, String identifier, Date from, Date to);

    WateringMeasure getWateringData(int userId, String identifier, Date from, Date to);

    Long getObservationsCounter(Long obspropId, int userId, String identifier, Date from, Date to);
    ObservableMeasure getObservationData(Long obspropId, int userId, String identifier, Date from, Date to);
    String getLastObservationsDate(int userId);

    List<ObservationMeasure> getLastObservationbyIdentifier(int userId, String identifier);

    AutomaticWater getLastWateringObsbyIdentifier(int userId, String identifier);

    void setObservationMinmaxValues(List<FeatureMinMaxValue> observationMinmaxList);
}
