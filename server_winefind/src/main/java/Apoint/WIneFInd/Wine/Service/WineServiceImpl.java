package Apoint.WIneFInd.Wine.Service;

import Apoint.WIneFInd.Wine.Domain.WineDTO;
import Apoint.WIneFInd.Wine.Model.Wine;
import Apoint.WIneFInd.Wine.Repository.WineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class WineServiceImpl implements WineService {

    private final WineRepository wineRepository;

    @Autowired
    public WineServiceImpl(WineRepository wineRepository) {
        this.wineRepository = wineRepository;
    }

    // 와인 정보 생성
    @Override
    @Transactional
    public Wine Save(WineDTO wineDTO) {

        // 입력받은 와인 정보에 따라 와인 생성
        Wine createWine = getCreateWine(wineDTO);

        return wineRepository.save(createWine);
    }

    private Wine getCreateWine(WineDTO wineDTO) {
        Wine createWine = Wine.builder()
                .wineName(wineDTO.getWineName())
                .type(wineDTO.getType())
                .country(wineDTO.getCountry())
                .grape(wineDTO.getGrape())
                .vintage(wineDTO.getVintage())
                .sweet(wineDTO.getSweet())
                .acidity(wineDTO.getAcidity())
                .body(wineDTO.getBody())
                .tannic(wineDTO.getTannic())
                .image(wineDTO.getImage())
                .comment(wineDTO.getComment())
                .price(wineDTO.getPrice())
                .build();
        return createWine;
    }


    // DB 안의 "Wine" 리스트 전체 조회
    @Override
    @Transactional(readOnly = true)
    public List<Wine> FindByAll() {

        return wineRepository.findAll();
    }

    // 입력받은 "Id"로 DB 안의 "Wine" 조회
    @Override
    @Transactional(readOnly = true)
    public Wine FindById(Long id) {

        // 와인을 DB 안에서 찾을시 없으면 에러 있으면 와인 리턴
        Wine wine = getWine(id);

        // 와인 리턴
        return wine;
    }

    private Wine getWine(Long id) {
        return wineRepository.findById(id).orElseThrow(() -> {
            throw new IllegalArgumentException("원하는 결과를 얻으시려면 id : " + id + " 를 제외한 'id' 를 다시 입력해 주세요. ");
        });
    }

    // 와인 정보 수정
    @Override
    @Transactional
    public Wine Update(WineDTO wineDTO, Long id) {

        // 입력받은 id로 와인 id 찾기
        Wine updateWine = getWine(id);

        // 입력받은 와인 형식에 맞춰서 업데이트 매소드 실행
        updateWine = getUpdateWine(wineDTO, updateWine);

        // 업데이트 리턴
        return updateWine;
    }

    private Wine getUpdateWine(WineDTO wineDTO, Wine updateWine) {
        updateWine = updateWine.builder()
                .wineName(wineDTO.getWineName())
                .type(wineDTO.getType())
                .country(wineDTO.getCountry())
                .grape(wineDTO.getGrape())
                .vintage(wineDTO.getVintage())
                .sweet(wineDTO.getSweet())
                .acidity(wineDTO.getAcidity())
                .body(wineDTO.getBody())
                .tannic(wineDTO.getTannic())
                .image(wineDTO.getImage())
                .comment(wineDTO.getComment())
                .price(wineDTO.getPrice())
                .build();
        return updateWine;
    }

    // 와인 정보 삭제
    @Override
    // 흠... no... for... 다해봤는데 왜 try catch로 안가지... 음...
    // 예외가 발생하면 아무것도 실행 안하고 그냥 롤백 하나? 에러 지정 못하나?
    // 내가 졌다... 아무것도 안되네 ㅁㅇㄹㅁㅇㄴㄹ
    @Transactional(noRollbackFor = EmptyResultDataAccessException.class)
    public String Delete(Long id) {

        try {
            wineRepository.deleteById(id);
            return "'Wine' 정보가 성공적으로 '삭제' 처리 되었습니다.";
        } catch (EmptyResultDataAccessException e) {
            return "와인을 삭제하시려면 " + id + " 를 제외한 'Id' 를 다시 입력해 주세요 " + e;
        }
    }
}
