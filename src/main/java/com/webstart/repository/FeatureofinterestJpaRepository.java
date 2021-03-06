package com.webstart.repository;

import com.webstart.DTO.*;
import com.webstart.model.Featureofinterest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;


import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

public interface FeatureofinterestJpaRepository extends JpaRepository<Featureofinterest, Integer> {


    List<Featureofinterest> findByUserid(int id);

    List<Featureofinterest> findByUseridAndFeatureofinteresttypeid(int id, long l);

    @Query("select new com.webstart.DTO.CropInfoDTO(fi.identifier, fi.name, obs.Identifier, prc.identifier, prc.descriptionfile) " +
            "from Featureofinterest as fi " +
            "inner join fi.seriesList as flist " +
            "inner join flist.observableProperty as obs " +
            "inner join flist.procedure as prc " +
            "WHERE fi.featureofinterestid IN :inclList")
    List<CropInfoDTO> getFeatureByIds(@Param("inclList") List<Integer> featuresid);

    @Query("select NEW com.webstart.DTO.FeatureObsPropMinMax(0, childfeature.identifier, '', obs.ObservablePropertyId, obspropval.obspropid, obs.Description, obspropval.minval, obspropval.maxval) " +
            "from Featureofinterest as feature " +
            "join feature.childrenFeatures childfeature " +
            "join childfeature.obspropminmaxList as obspropval " +
            "join obspropval.observableProperty as obs " +
            "where feature.identifier = :identifier")
    List<FeatureObsPropMinMax> findChildMiMaxValuesByIdentifier(@Param("identifier") String identifier);

    @Query("select NEW com.webstart.DTO.FeatureObsPropMinMax(feature.featureofinterestid, feature.identifier, feature.name, obs.ObservablePropertyId, obspropval.obspropid, obs.Description, obspropval.minval, obspropval.maxval) " +
            "from Featureofinterest as feature " +
            "join feature.obspropminmaxList as obspropval " +
            "join obspropval.observableProperty as obs " +
            "where feature.userid = :user_id")
    List<FeatureObsPropMinMax> findFeatureMiMaxValuesByUserId(@Param("user_id") Integer userid);

    @Query("select fi.datetimefrom, fi.datetimeto " +
            "FROM Featureofinterest as fi " +
            "WHERE fi.identifier = :identif")
    List<Object[]> findDatesByIdentifier(@Param("identif") String identif);

    @Query("select children.identifier FROM Featureofinterest as fi " +
            "join fi.childrenFeatures children " +
            "WHERE fi.identifier = :identifier")
    List<String> findEndDevicesByCoord(@Param("identifier") String identifier);

    @Query("select parent.featureofinterestid FROM Featureofinterest as fi " +
            "join fi.parentFeature parent " +
            "WHERE fi.identifier = :identifier and fi.featureofinteresttypeid = 3 and fi.userid = :userid")
    List<Integer> findCoordinatorIdByEndDevice(@Param("identifier") String identifier, @Param("userid") int userid);

    @Query("select distinct NEW com.webstart.DTO.FeatureidIdentifier(fi.featureofinterestid, fi.identifier) " +
            "FROM Featureofinterest as fi " +
            "WHERE fi.identifier IN :idenList")
    List<FeatureidIdentifier> getIdidentif(@Param("idenList") List<String> identStr);

    @Query("select si.seriesid " +
            "FROM Series as si " +
            "WHERE si.featureofinterestid = :featid and si.observablepropertyid = :obspropid")
    List<Long> getAllSeriesId(@Param("featid") Long fid, @Param("obspropid") Long obsg);

    @Query("select fi.featureofinterestid FROM Featureofinterest as fi  WHERE fi.identifier = :tid")
    List<Integer> getIdbyIdent(@Param("tid") String fidentent);

    @Query("select new com.webstart.DTO.EndDeviceStatusDTO(fi.identifier, fi.irrigation, fi.measuring, fi.datetimefrom, fi.datetimeto) " +
            "FROM Featureofinterest as fi " +
            "WHERE fi.parentid = :pid " +
            "order by fi.identifier")
    List<EndDeviceStatusDTO> getIdentifierFlags(@Param("pid") Long parId);

    @Query(value = "select fi.identifier, " +
            "to_char(fi.datetimefrom, 'HH24')  as fromhour, " +
            "to_char(fi.datetimefrom, 'MI') as fromminute, " +
            "to_char(fi.datetimeto, 'HH24') as tohour, " +
            "to_char(fi.datetimeto, 'MI') as tominute " +
            "from Featureofinterest as fi " +
            "WHERE fi.identifier = :identifier " +
            "order by fi.identifier",
            nativeQuery = true)
    List<Object[]> getCoordinatorTimes(@Param("identifier") String identifier);

    @Query(value = "select fi.identifier, " +
            "to_char(childfi.datetimefrom, 'HH24') as fromhour, " +
            "to_char(childfi.datetimefrom, 'MI') as fromminute, " +
            "to_char(childfi.datetimeto, 'HH24') as tohour, " +
            "to_char(childfi.datetimeto, 'MI') as tominute " +
            "from Featureofinterest as fi " +
            "inner join Featureofinterest childfi on childfi.parentid = fi.featureofinterestid " +
            "WHERE fi.identifier = :identifier AND childfi.featureofinteresttypeid = 3 " +
            "order by fi.identifier",
            nativeQuery = true)
    List<Object[]> getEnddevicesTimes(@Param("identifier") String identifier);

    @Query("select new com.webstart.DTO.AutomaticWater(parent.datetimefrom, parent.datetimeto, parent.waterConsumption, parent.identifier) " +
            "FROM Featureofinterest as fi " +
            "JOIN fi.parentFeature as parent " +
            "WHERE fi.userid = :user_id and fi.identifier = :identifier and fi.featureofinteresttypeid = 3 ")
    AutomaticWater getAutomaticWater(@Param("user_id") Integer userid, @Param("identifier") String identifier);

    @Query("select parent.waterConsumption " +
            "from Featureofinterest as fi " +
            "join fi.parentFeature as parent " +
            "where fi.identifier = :identifier and fi.featureofinteresttypeid = 3")
    List<BigDecimal> getWaterConsumption(@Param("identifier") String identifier);

    @Modifying
    @Query("update ObservablePropertyMinMax obsprop set obsprop.minval = :minval, obsprop.maxval = :maxval where obsprop.obspropid = :obspropid")
    @Transactional
    void setObservableMinmax(@Param("obspropid") Long obspropvalid, @Param("minval") BigDecimal minimum, @Param("maxval") BigDecimal maximum);

    @Modifying
    @Query("update Featureofinterest f set f.measuring = true where f.userid IN :usid and f.featureofinteresttypeid = :tpid")
    @Transactional
    void setMeasuringFlag(@Param("usid") int useid, @Param("tpid") long ftypeid);

    @Modifying
    @Query("update Featureofinterest f set f.measuring = false where f.identifier IN :identifierlist")
    @Transactional
    void setMeasuringFlagFalse(@Param("identifierlist") List<String> identifierlist);

    @Modifying
    @Query("update Featureofinterest f set f.irrigation = true, f.datetimefrom = :dtfrom, f.datetimeto = :dtto " +
            "where f.userid = :usid and f.identifier = :identifier")
    @Transactional
    void setDeviceIrrigDates(@Param("usid") int userid, @Param("identifier") String device, @Param("dtfrom") Date datetimefrom, @Param("dtto") Date datetimeto);

    @Modifying
    @Query("update Featureofinterest f set f.datetimefrom = :dtfrom, f.datetimeto = :dtto, f.waterConsumption = :wc " +
            "where  f.identifier = :identifier and f.featureofinteresttypeid = 2")
    @Transactional
    void setCoordinatorAlgorithmParams(@Param("identifier") String identifier, @Param("dtfrom") Date datetimefrom, @Param("dtto") Date datetimeto, @Param("wc") BigDecimal waterconsumption);




}
